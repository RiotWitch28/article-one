#!/usr/bin/env python3
"""Regenerate committees.js legislative-activity numbers from real LegiScan data.

Bucket 2 of the committee work. Bucket 1 gave each committee its real chair,
member count, and party split. Those fields are PRESERVED here. This script
replaces only the legislative-activity numbers that were modeled placeholders:

    referred, passed, failed, inCommittee, law, successRate

It pulls the LegiScan *bulk dataset* for the 119th Congress (one ZIP of every
bill as JSON) rather than calling getBill per bill, so the whole run costs only
a few API requests — comfortably inside the free tier's monthly quota.

Usage:
    export LEGISCAN_API_KEY=xxxxxxxx        # your free key from legiscan.com
    python3 tools/legiscan_committees.py            # rewrite committees.js
    python3 tools/legiscan_committees.py --inspect   # dump shapes, write nothing
    python3 tools/legiscan_committees.py --dry-run    # aggregate + print, write nothing

Stdlib only — no pip install needed.

NOTE ON "meetings": LegiScan's bulk dataset does not reliably carry per-committee
hearing/meeting counts, so this script leaves the existing `meetings` value
untouched. If we want real meeting counts later, congress.gov's committee-meetings
endpoint is the better source.
"""

import base64
import io
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import zipfile
from collections import defaultdict
from datetime import datetime, timezone

API = "https://api.legiscan.com/"
HERE = os.path.dirname(os.path.abspath(__file__))
COMMITTEES_JS = os.path.normpath(os.path.join(HERE, "..", "committees.js"))
OVERVIEW_JS = os.path.normpath(os.path.join(HERE, "..", "overview.js"))

# LegiScan bill status ids
STATUS_INTRODUCED = 1   # still in committee / not yet advanced
STATUS_ENGROSSED = 2    # passed its originating chamber
STATUS_ENROLLED = 3     # passed both chambers
STATUS_PASSED = 4       # enacted / signed into law
STATUS_VETOED = 5
STATUS_FAILED = 6


def api_call(op, **params):
    """Call the LegiScan API and return the parsed JSON payload."""
    key = os.environ.get("LEGISCAN_API_KEY")
    if not key:
        sys.exit("ERROR: set LEGISCAN_API_KEY (get a free key at legiscan.com).")
    q = {"key": key, "op": op, **params}
    url = API + "?" + urllib.parse.urlencode(q)
    with urllib.request.urlopen(url, timeout=60) as r:
        data = json.loads(r.read().decode("utf-8"))
    if data.get("status") != "OK":
        sys.exit(f"LegiScan API error on op={op}: {data.get('alert') or data}")
    return data


def find_119th_session():
    """Return the LegiScan session_id for the 119th US Congress."""
    data = api_call("getSessionList", state="US")
    for s in data["sessions"]:
        name = (s.get("session_name") or "") + " " + (s.get("name") or "")
        if "119" in name:
            return s["session_id"], name.strip()
    # Fallback: newest non-special session
    sess = sorted(data["sessions"], key=lambda s: s.get("year_start", 0))
    return sess[-1]["session_id"], sess[-1].get("session_name", "?")


def download_dataset(session_id):
    """Download + unzip the bulk dataset; return a list of bill dicts."""
    dl = api_call("getDatasetList", state="US", id=session_id)
    if not dl.get("datasetlist"):
        sys.exit("No dataset available for that session yet.")
    ds_meta = dl["datasetlist"][0]
    ds = api_call("getDataset", id=session_id, access_key=ds_meta["access_key"])
    raw = base64.b64decode(ds["dataset"]["zip"])
    bills = []
    with zipfile.ZipFile(io.BytesIO(raw)) as z:
        for name in z.namelist():
            if "/bill/" in name and name.endswith(".json"):
                obj = json.loads(z.read(name).decode("utf-8"))
                if "bill" in obj:
                    bills.append(obj["bill"])
    return bills


def norm(name):
    """Normalize a committee name for fuzzy matching across naming styles."""
    n = name.lower()
    n = re.sub(r"\b(house|senate|joint|permanent|select|subcommittee|committee|on|of|the|congress)\b", " ", n)
    n = re.sub(r"[^a-z0-9 ]", " ", n)
    return re.sub(r"\s+", " ", n).strip()


def referral_committees(bill):
    """Names of House committees this bill was referred to.

    LegiScan returns `referrals`/`committee` as an empty list ([]) when absent,
    or a list-of-dicts / dict respectively when present, so guard the types.
    """
    out = []
    refs = bill.get("referrals")
    if isinstance(refs, list):
        for ref in refs:
            if not isinstance(ref, dict):
                continue
            if (ref.get("chamber") or ref.get("body") or "H") in ("H", "House"):
                if ref.get("name"):
                    out.append(ref["name"])
    if not out:
        cm = bill.get("committee")
        if isinstance(cm, dict) and cm.get("name"):
            out.append(cm["name"])
    # Dedupe so a bill re-referred to the same committee counts once.
    return list(dict.fromkeys(out))


def is_house_origin(bill):
    bn = (bill.get("bill_number") or "").upper()
    body = bill.get("body") or bill.get("current_body") or ""
    return bn.startswith("H") or body in ("H", "House")


def aggregate(bills):
    """Tally activity metrics per normalized committee name."""
    tally = defaultdict(lambda: dict(referred=0, passed=0, failed=0, inCommittee=0, law=0))
    for b in bills:
        if not is_house_origin(b):
            continue
        status = int(b.get("status") or 0)
        for cname in referral_committees(b):
            t = tally[norm(cname)]
            t["referred"] += 1
            if status >= STATUS_ENGROSSED:        # passed the House
                t["passed"] += 1
            if status == STATUS_PASSED:            # enacted
                t["law"] += 1
            if status in (STATUS_VETOED, STATUS_FAILED):
                t["failed"] += 1
            if status == STATUS_INTRODUCED:        # still sitting in committee
                t["inCommittee"] += 1
    return tally


def load_committees_js():
    """Parse committees.js (window.COMMITTEES = [...];) into a Python list."""
    src = open(COMMITTEES_JS, encoding="utf-8").read()
    arr = src[src.index("["): src.rindex("]") + 1]
    return json.loads(arr)


def write_committees_js(committees):
    body = json.dumps(committees, separators=(", ", ": "), ensure_ascii=False)
    open(COMMITTEES_JS, "w", encoding="utf-8").write("window.COMMITTEES = " + body + ";\n")


def _orig(b):
    return b.get("body") or b.get("current_body") or ""


def _cur(b):
    return b.get("current_body") or b.get("body") or ""


def compute_overview(bills):
    """House Overview legislative-activity figures, by agreed definitions:

      billsIntroduced   H.R. bills introduced in the House (bill_type B, House-origin)
      sentToSenate      House-origin bills passed the House, now in the Senate
      receivedFromSenate Senate-origin bills currently in the House
      lawsCreated       House-origin bills enacted into law (status 4)

    'Days in Session' is intentionally absent — it's a House-calendar metric,
    not derivable from bill data; it stays hardcoded in the template.
    """
    house = [b for b in bills if _orig(b) == "H"]
    senate = [b for b in bills if _orig(b) == "S"]
    return {
        "billsIntroduced": sum(1 for b in house if (b.get("bill_type") == "B")),
        "sentToSenate": sum(1 for b in house if _cur(b) == "S"),
        "receivedFromSenate": sum(1 for b in senate if _cur(b) == "H"),
        "lawsCreated": sum(1 for b in house if int(b.get("status") or 0) == STATUS_PASSED),
    }


def write_overview_js(ov):
    out = dict(ov)
    out["generatedAt"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    body = json.dumps(out, separators=(", ", ": "), ensure_ascii=False)
    open(OVERVIEW_JS, "w", encoding="utf-8").write("window.OVERVIEW = " + body + ";\n")


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    session_id, session_name = find_119th_session()
    print(f"Session: {session_name} (id={session_id})")
    bills = download_dataset(session_id)
    print(f"Bills in dataset: {len(bills)}")

    if mode == "--inspect":
        populated = next((b for b in bills if isinstance(b.get("referrals"), list)
                          and b["referrals"]), None)
        if populated:
            print("\nExample bill WITH referrals:", populated.get("bill_number"))
            print("  committee:", json.dumps(populated.get("committee")))
            print("  referrals:", json.dumps(populated.get("referrals"), indent=2)[:700])
        n_refs = sum(1 for b in bills if isinstance(b.get("referrals"), list) and b["referrals"])
        n_cmte = sum(1 for b in bills if isinstance(b.get("committee"), dict))
        print(f"\nHouse-origin bills: {sum(1 for b in bills if is_house_origin(b))}")
        print(f"Bills with referrals: {n_refs}   Bills with committee dict: {n_cmte}")
        # Distribution of referral committee names vs our 27 local names
        dist = defaultdict(int)
        for b in bills:
            if is_house_origin(b):
                for cn in referral_committees(b):
                    dist[cn] += 1
        local = {norm(c["name"]): c["name"] for c in load_committees_js()}
        print(f"\nDistinct referral committees seen: {len(dist)}")
        print("Top referral committees (✓ = matches a local committee):")
        for cn, n in sorted(dist.items(), key=lambda kv: -kv[1])[:40]:
            mark = "✓" if norm(cn) in local else "·"
            print(f"  {mark} {n:>5}  {cn}")
        return

    tally = aggregate(bills)
    committees = load_committees_js()
    lookup = {norm(c["name"]): c["name"] for c in committees}

    matched, unmatched_local = [], []
    for c in committees:
        t = tally.get(norm(c["name"]))
        if not t:
            # Select/joint committees that don't take bill referrals: show real
            # zeros rather than leaving stale placeholder numbers in place.
            c["referred"] = c["passed"] = c["failed"] = c["inCommittee"] = c["law"] = 0
            c["successRate"] = 0.0
            unmatched_local.append(c["name"])
            continue
        c["referred"] = t["referred"]
        c["passed"] = t["passed"]
        c["failed"] = t["failed"]
        c["inCommittee"] = t["inCommittee"]
        c["law"] = t["law"]
        c["successRate"] = round(t["passed"] / t["referred"] * 100, 1) if t["referred"] else 0.0
        matched.append(c["name"])

    unmatched_legiscan = [k for k in tally if k not in lookup]

    print(f"\nMatched {len(matched)}/{len(committees)} committees.")
    if unmatched_local:
        print("Zeroed (no bill referrals — select/joint oversight committees):")
        for n in unmatched_local:
            print("   -", n)
    if unmatched_legiscan:
        print("LegiScan committees with no local match (need an alias?):")
        for k in sorted(unmatched_legiscan)[:30]:
            print("   -", k, dict(tally[k]))

    overview = compute_overview(bills)
    print("\nHouse Overview figures:", json.dumps(overview))

    if mode == "--dry-run":
        print("\n--dry-run: not writing committees.js / overview.js")
        for c in committees:
            print(f'  {c["name"][:40]:40} ref={c["referred"]:>4} pass={c["passed"]:>4} '
                  f'fail={c["failed"]:>3} inCom={c["inCommittee"]:>4} law={c["law"]:>3}')
        return

    write_committees_js(committees)
    print(f"\nWrote {COMMITTEES_JS}")
    write_overview_js(overview)
    print(f"Wrote {OVERVIEW_JS}")


if __name__ == "__main__":
    main()
