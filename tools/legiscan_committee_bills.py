#!/usr/bin/env python3
"""Build per-committee bill lists for the Committees popup from LegiScan RSS.

Each committee can have a GAITS feed (a LegiScan monitored-list RSS scoped to
one committee — the kind you create at legiscan.com/gaits). This script reads
the committee -> feed-URL map in data/committee_feeds.json, fetches and parses
each feed server-side (no browser CORS limits), and writes one JSON file per
committee under data/committee-bills/<slug>.json:

    { "committee": "...", "feed": "<rss url>", "count": N,
      "bills": [ { "num": "H.R. 1371", "title": "...",
                   "url": "https://legiscan.com/US/bill/HR1371/2025",
                   "date": "2026-06-18" }, ... ] }

The popup lazy-fetches that file by slug when a committee is opened. A feed
carries ~100 most-recently-active items, already newest-first; we re-sort by
date to be safe.

Why RSS and not the bulk dataset: the feed arrives pre-shaped (number, title,
link, action date) and pre-scoped to one committee, so ingesting it is far
simpler than re-deriving referral lists from the full-session dataset. The
tradeoff is the ~100-item cap per feed.

Usage:
    python3 tools/legiscan_committee_bills.py            # build every mapped committee
    python3 tools/legiscan_committee_bills.py --dry-run  # parse + print, write nothing

Stdlib only. No API key needed (GAITS feed URLs are self-authenticating).
"""

import html
import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from email.utils import parsedate_to_datetime

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, ".."))
FEED_MAP = os.path.join(ROOT, "data", "committee_feeds.json")
OUT_DIR = os.path.join(ROOT, "data", "committee-bills")

# LegiScan US bill-type code -> display prefix (Congressional citation style).
NUM_PREFIX = {
    "HB": "H.R.", "HR": "H.Res.", "HJR": "H.J.Res.", "HCR": "H.Con.Res.",
    "SB": "S.", "SR": "S.Res.", "SJR": "S.J.Res.", "SCR": "S.Con.Res.",
}


def slugify(name):
    """Committee name -> filename slug. MUST match the JS comSlug() in index.html."""
    n = name.lower().replace("&", "and")
    n = re.sub(r"[^a-z0-9]+", "-", n)
    return n.strip("-")


def format_number(raw):
    """'US HR1371' / 'HB9335' -> 'H.Res. 1371' / 'H.R. 9335'."""
    code = raw.strip()
    if code.upper().startswith("US "):
        code = code[3:].strip()
    m = re.match(r"^([A-Za-z]+)\s*0*(\d+)$", code)
    if not m:
        return code
    prefix, digits = m.group(1).upper(), m.group(2)
    return f"{NUM_PREFIX.get(prefix, prefix)} {digits}"


def clean_link(url):
    """Drop tracking query params -> clean bill URL."""
    return url.split("?", 1)[0].strip()


def parse_description(desc):
    """Split a feed item's description into (title, action_date_iso).

    Format: '<bill title><br/><br/>YYYY/MM/DD <last action text>'.
    Returns the title only; the date is taken from pubDate by the caller.
    """
    text = html.unescape(desc or "")
    title = re.split(r"<br\s*/?>", text, maxsplit=1)[0]
    return re.sub(r"\s+", " ", title).strip()


def parse_feed(xml_bytes):
    root = ET.fromstring(xml_bytes)
    bills = []
    for item in root.iterfind(".//item"):
        title_el = item.findtext("title") or ""
        link = item.findtext("link") or ""
        desc = item.findtext("description") or ""
        pub = item.findtext("pubDate") or ""
        date_iso = ""
        if pub:
            try:
                date_iso = parsedate_to_datetime(pub).date().isoformat()
            except (TypeError, ValueError):
                date_iso = ""
        bills.append({
            "num": format_number(title_el),
            "title": parse_description(desc),
            "url": clean_link(link),
            "date": date_iso,
        })
    # Newest action first (feeds usually arrive this way; enforce it).
    bills.sort(key=lambda b: b["date"], reverse=True)
    return bills


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "article-one/committee-bills"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    dry = "--dry-run" in sys.argv[1:]
    with open(FEED_MAP, encoding="utf-8") as f:
        feeds = json.load(f)
    if not feeds:
        sys.exit("No feeds in data/committee_feeds.json yet.")

    if not dry:
        os.makedirs(OUT_DIR, exist_ok=True)

    for name, url in feeds.items():
        slug = slugify(name)
        try:
            bills = parse_feed(fetch(url))
        except Exception as e:  # noqa: BLE001 - report and continue to next feed
            print(f"  ! {name}: {e}")
            continue
        payload = {"committee": name, "feed": url, "count": len(bills), "bills": bills}
        print(f"  {name:40} {len(bills):>3} bills -> {slug}.json")
        if dry:
            for b in bills[:5]:
                print(f"      {b['date']}  {b['num']:<12} {b['title'][:70]}")
            continue
        out = os.path.join(OUT_DIR, slug + ".json")
        with open(out, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=0)

    if dry:
        print("\n--dry-run: nothing written.")
    else:
        print(f"\nWrote {len(feeds)} file(s) to {OUT_DIR}")


if __name__ == "__main__":
    main()
