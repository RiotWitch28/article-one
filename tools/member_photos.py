#!/usr/bin/env python3
"""Build member_photos.js — official member portrait URLs from Congress.gov.

members.js keys each member by bioguide ID (the `id` field). Congress.gov's
member endpoint returns an official photo per member as depiction.imageUrl
(e.g. https://www.congress.gov/img/member/n000191_200.jpg). We pull the current
member list (paginated) and write a { bioguideId: imageUrl } map. Members with
no photo (e.g. brand-new members) are simply omitted -> the UI falls back to
initials.

Browser <img> loads these cross-origin fine (no CORS needed for images).
Re-run to refresh: python3 tools/member_photos.py
"""
import json, os, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = os.path.expanduser("~")

def read_key():
    for p in [os.path.join(ROOT, ".congress_key"), os.path.join(HOME, ".config/article-one/congress.key")]:
        try:
            with open(p) as f:
                v = f.read().strip()
                if v:
                    return v
        except OSError:
            pass
    return os.environ.get("CONGRESS_API_KEY", "").strip()

CK = read_key()
if not CK:
    sys.exit("Missing .congress_key (see memory: congress-gov-api).")

def cg(path):
    sep = "&" if "?" in path else "?"
    req = urllib.request.Request(
        "https://api.congress.gov/v3/" + path + sep + "format=json&api_key=" + CK,
        headers={"User-Agent": "Mozilla/5.0"})  # Cloudflare blocks default UA
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def main():
    photos = {}
    offset, limit = 0, 250
    while True:
        data = cg(f"member?currentMember=true&limit={limit}&offset={offset}")
        members = data.get("members", [])
        if not members:
            break
        for m in members:
            bid = m.get("bioguideId")
            url = (m.get("depiction") or {}).get("imageUrl")
            if bid and url:
                photos[bid] = url
        offset += limit
        total = (data.get("pagination") or {}).get("count", 0)
        if offset >= total:
            break

    out = os.path.join(ROOT, "member_photos.js")
    with open(out, "w") as f:
        f.write("window.MEMBER_PHOTOS = " + json.dumps(photos, ensure_ascii=False, sort_keys=True) + ";\n")
    print(f"Wrote {out}: {len(photos)} member photos")

if __name__ == "__main__":
    main()
