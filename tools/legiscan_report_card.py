#!/usr/bin/env python3
"""Build report-card.js — the House Report Card data, from the LegiScan dataset.

Two parts, both derived by parsing each bill's action history (which the
committees.js / overview.js pipelines don't capture):

  pipeline   — where every House (H.R.) bill sits now:
                 inCommittee        still in committee (not reported out)
                 floorVotePending   reported out, not yet voted on the floor
                 sentToSenate       passed the House, now in the Senate
                 sentBackFromSenate passed House, Senate amended it, returned
                 becameLaw          enacted

  committees — each standing committee rated on EFFICIENCY: the share of the
               bills referred to it that it reports out to the floor. Stars:
                 5★ 20%+ · 4★ 15-20% · 3★ 10-15% · 2★ 5-10% · 1★ under 5%
               Committees with very few referrals are flagged lowSample.

Reuses helpers from legiscan_committees.py (dataset download, referral logic).

Usage:
    LEGISCAN_API_KEY="$(tr -d '[:space:]' < .legiscan_key)" python3 tools/legiscan_report_card.py
    python3 tools/legiscan_report_card.py --dry-run
"""
import json
import os
import re
import sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import legiscan_committees as LC  # noqa: E402

OUT_FILE = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "report-card.js"))
MIN_REFERRED = 25  # below this, the efficiency rate is too noisy to trust

# A committee voted to send a bill to the floor.
REPORT = re.compile(
    r"(ordered.*reported|reported an original|reported.*(?:measure|amend|favorab)"
    r"|committee on .*reported|reported by the committee|union calendar)", re.I)
# Pull the committee name out of a report action, e.g.
# "The House Committee on Natural Resources reported ..." -> "Natural Resources".
REPORT_COMMITTEE = re.compile(r"committee on ([a-z0-9,&'’ .\-]+?)\s+(?:reported|discharged)", re.I)
# The Senate amended a House bill and sent it back for the House to act on.
SENATE_RETURN = re.compile(
    r"(passed senate with an? amendment|passed senate with amendments"
    r"|agree(?:d)? to the senate amendment|house agree(?:d)? to senate amendment"
    r"|disagree.*senate amendment|recede.*senate amendment)", re.I)


def actions(bill):
    return [(h.get("action") or "") for h in (bill.get("history") or [])]


def is_reported(bill):
    return any(REPORT.search(a) for a in actions(bill))


def report_committee(bill, local):
    """Committee that reported the bill, from the action text; else its referral."""
    for a in actions(bill):
        if not REPORT.search(a):
            continue
        m = REPORT_COMMITTEE.search(a)
        if m:
            key = LC.norm(m.group(1))
            if key in local:
                return local[key]
    for cn in LC.referral_committees(bill):
        key = LC.norm(cn)
        if key in local:
            return local[key]
    return None


def cur_body(bill):
    return bill.get("current_body") or bill.get("body") or ""


def stars(rate):
    return 5 if rate >= 20 else 4 if rate >= 15 else 3 if rate >= 10 else 2 if rate >= 5 else 1


def main():
    dry = "--dry-run" in sys.argv[1:]
    sid, name = LC.find_119th_session()
    print(f"Session: {name} (id={sid})")
    bills = LC.download_dataset(sid)
    local = {LC.norm(c["name"]): c["name"] for c in LC.load_committees_js()}

    # ---- Pipeline (House H.R. bills) ----
    hr = [b for b in bills if LC.is_house_origin(b) and b.get("bill_type") == "B"]
    pipe = dict(inCommittee=0, floorVotePending=0, sentToSenate=0, sentBackFromSenate=0, becameLaw=0)
    for b in hr:
        status = int(b.get("status") or 0)
        rep = is_reported(b)
        if status == 1 and not rep:
            pipe["inCommittee"] += 1
        elif rep and status < 2:
            pipe["floorVotePending"] += 1
        if status >= 2 and cur_body(b) == "S":
            pipe["sentToSenate"] += 1
        if status >= 2 and cur_body(b) == "H" and any(SENATE_RETURN.search(a) for a in actions(b)):
            pipe["sentBackFromSenate"] += 1
        if status == 4:
            pipe["becameLaw"] += 1

    # ---- Committee efficiency (all House-origin bills) ----
    referred = {c["name"]: 0 for c in LC.load_committees_js()}
    reported = {c["name"]: 0 for c in LC.load_committees_js()}
    for b in hr:  # actual H.R. bills only — keeps it about legislation, not resolutions
        for cn in LC.referral_committees(b):
            key = LC.norm(cn)
            if key in local:
                referred[local[key]] += 1
                break
        if is_reported(b):
            owner = report_committee(b, local)
            if owner:
                reported[owner] += 1

    rows = []
    for cname, ref in referred.items():
        rep = reported[cname]
        if ref == 0 and rep == 0:
            continue
        denom = max(ref, rep)  # guard: a reported original measure may not be "referred"
        rate = round(rep / denom * 100, 1) if denom else 0.0
        rows.append({
            "name": cname, "reported": rep, "referred": denom,
            "rate": rate, "stars": stars(rate), "lowSample": denom < MIN_REFERRED,
        })
    rows.sort(key=lambda r: (-r["rate"], -r["reported"]))

    report = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "pipeline": pipe,
        "committees": rows,
    }

    print("\nPipeline:", json.dumps(pipe))
    print(f"\n{'committee':34} rep  ref  rate  stars  sample")
    for r in rows:
        flag = "  low" if r["lowSample"] else ""
        print(f"  {r['name'][:32]:32} {r['reported']:>3} {r['referred']:>4} "
              f"{r['rate']:>5}%  {'*' * r['stars']:<5}{flag}")

    if dry:
        print("\n--dry-run: not writing report-card.js")
        return
    js = ("// Auto-generated by tools/legiscan_report_card.py — do not edit by hand.\n"
          "// Source: LegiScan bulk dataset, 119th Congress (CC BY 4.0).\n"
          "window.REPORT_CARD = " + json.dumps(report, ensure_ascii=False) + ";\n")
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        f.write(js)
    print(f"\nWrote {os.path.relpath(OUT_FILE)}")


if __name__ == "__main__":
    main()
