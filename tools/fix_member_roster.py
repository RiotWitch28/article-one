#!/usr/bin/env python3
"""Correct the app's member roster (members.js) for mid-term seat changes.

The master list (data/members.json, from 119th_MASTER_LIST.xlsx) tags each
person with a `status` ("Sitting (<bioguide>)" or "Left during 119th (...)").
The app's members.js was generated WITHOUT that status, so it includes members
who already left — inflating the chamber to 442 and skewing the party balance.

This script reconciles members.js against the master:

1. Drops members who left AND whose seat has a sitting replacement (a genuine,
   data-confirmed seat change). Members marked "Left" with NO replacement are
   KEPT as sitting — they're known-active and dropping them would invent
   phantom vacancies (the master's status is messy for these).
2. Applies a small set of documented factual corrections the master got wrong.

Re-runnable: safe to run repeatedly. Reads data/members.json, rewrites
members.js. Reports the seat changes so the UI footnote can cite the count.
"""

import json
import os
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
MASTER = os.path.normpath(os.path.join(HERE, "..", "data", "members.json"))
MEMBERS_JS = os.path.normpath(os.path.join(HERE, "..", "members.js"))
SEAT_CHANGES_JS = os.path.normpath(os.path.join(HERE, "..", "seat_changes.js"))

# Factual corrections where the master list is wrong (bioguide -> field updates).
CORRECTIONS = {
    "K000401": {"party": "Republican"},  # Kevin Kiley (CA-3) — master says Independent
}


def departed_with_replacement(master):
    """Bioguides of members who left a seat that a sitting member now holds."""
    by_seat = defaultdict(list)
    for m in master.values():
        by_seat[(m["state"], str(m["district"]))].append(m)
    departed = {}
    for seat, people in by_seat.items():
        left = [p for p in people if (p.get("status") or "").startswith("Left")]
        sitting = [p for p in people if (p.get("status") or "").startswith("Sitting")]
        if left and sitting:
            for p in left:
                departed[p["bioguide"]] = {
                    "name": p["full_name"], "seat": f"{p['state']}-{p['district']}",
                    "replacedBy": sitting[0]["full_name"],
                }
    return departed


def load_members_js():
    src = open(MEMBERS_JS, encoding="utf-8").read()
    return json.loads(src[src.index("["): src.rindex("]") + 1])


def write_members_js(members):
    body = json.dumps(members, separators=(",", ":"), ensure_ascii=False)
    open(MEMBERS_JS, "w", encoding="utf-8").write("window.MEMBERS = " + body + ";\n")


def main():
    master = json.load(open(MASTER, encoding="utf-8"))["members"]
    departed = departed_with_replacement(master)

    members = load_members_js()
    before = len(members)
    members = [m for m in members if m.get("id") not in departed]

    fixed = []
    for m in members:
        upd = CORRECTIONS.get(m.get("id"))
        if upd:
            m.update(upd)
            fixed.append(m.get("name"))

    write_members_js(members)

    # Emit the seat-change list so the UI footnote can stay accurate without
    # hardcoding a count.
    changes = [
        {"seat": info["seat"], "left": info["name"], "replacedBy": info["replacedBy"]}
        for info in sorted(departed.values(), key=lambda i: i["seat"])
    ]
    sc_body = json.dumps(changes, separators=(",", ":"), ensure_ascii=False)
    open(SEAT_CHANGES_JS, "w", encoding="utf-8").write("window.SEAT_CHANGES = " + sc_body + ";\n")

    print(f"Members: {before} -> {len(members)}  (removed {before - len(members)} departed)")
    print(f"\nSeat changes ({len(departed)}):")
    for bg, info in sorted(departed.items(), key=lambda kv: kv[1]["seat"]):
        print(f"  {info['seat']:7} {info['name']}  ->  {info['replacedBy']}")
    if fixed:
        print("\nFactual corrections:", ", ".join(fixed))


if __name__ == "__main__":
    main()
