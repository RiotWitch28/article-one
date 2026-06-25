#!/usr/bin/env python3
"""Build committee_schedule.js — this week's House committee meetings.

Merges two live sources (browser can't call either: no CORS + keys are secret):
  - DomeWatch  /v1/committee-meetings  -> the rolling ~1-week schedule with
    real start/end times, location, and meeting type (but no committee name).
  - Congress.gov /committee-meeting/119/house/{eventId} -> committee name,
    hearing/markup title, witnesses, documents, video availability, status.

Output: window.COMMITTEE_SCHEDULE, shaped so index.html can render the
"This Week" calendar + click-through popup with minimal work, including
ready-made "Add to calendar" links (Google + downloadable .ics data URI).

Keys: reads .domewatch_key and .congress_key from the repo root, falling back
to ~/.config/article-one/congress.key and env vars. Run: python3 tools/committee_schedule.py
"""
import json, os, re, sys, urllib.request, urllib.parse
from datetime import datetime, timezone, timedelta
try:
    from zoneinfo import ZoneInfo
    ET = ZoneInfo("America/New_York")
except Exception:
    ET = timezone(timedelta(hours=-4))  # fallback (EDT)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOME = os.path.expanduser("~")

def read_key(repo_name, env_name, *extra_paths):
    for p in [os.path.join(ROOT, repo_name), *extra_paths]:
        try:
            with open(p) as f:
                v = f.read().strip()
                if v:
                    return v
        except OSError:
            pass
    return os.environ.get(env_name, "").strip()

DK = read_key(".domewatch_key", "DOMEWATCH_API_KEY")
CK = read_key(".congress_key", "CONGRESS_API_KEY", os.path.join(HOME, ".config/article-one/congress.key"))
if not DK or not CK:
    sys.exit("Missing key(s): need .domewatch_key and .congress_key (see memory: congress-gov-api).")

def dome(path):
    req = urllib.request.Request("https://data.domewatch.us" + path, headers={"X-API-Key": DK})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def cg(path):
    sep = "&" if "?" in path else "?"
    req = urllib.request.Request(
        "https://api.congress.gov/v3/" + path + sep + "format=json&api_key=" + CK,
        headers={"User-Agent": "Mozilla/5.0"})  # Cloudflare blocks default UA (403/1010)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

TYPE = {"HHRG": ("hearing", "Hearing"), "HMKP": ("markup", "Markup"), "HMTG": ("meeting", "Meeting")}
COLOR = {"hearing": "#1c4670", "markup": "#b8862f", "meeting": "#6c7686"}

def short_com(n):
    if not n:
        return "U.S. House"
    n = re.sub(r"^House\s+", "", n)
    n = re.sub(r"\s+Subcommittee on\s+", " · ", n)
    n = re.sub(r"\s+Subcommittee$", "", n)
    return n.strip()

def clean(s):
    return re.sub(r"\s+", " ", (s or "")).strip().strip('"').strip("“”").strip()

def short_bldg(b):
    return (b or "").replace("House Office Building", "HOB").strip()

def utc_stamp(iso):
    dt = datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(timezone.utc)
    return dt.strftime("%Y%m%dT%H%M%SZ")

def google_url(title, start, end, location, details):
    q = urllib.parse.urlencode({
        "action": "TEMPLATE", "text": title, "dates": f"{start}/{end}",
        "location": location, "details": details})
    return "https://calendar.google.com/calendar/render?" + q

def ics_href(uid, title, start, end, location, details, cancelled):
    esc = lambda s: (s or "").replace("\\", "\\\\").replace(",", "\\,").replace(";", "\\;").replace("\n", "\\n")
    lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Article One//Committee Schedule//EN",
             "BEGIN:VEVENT", f"UID:{uid}@articleone.us",
             f"DTSTAMP:{utc_stamp(datetime.now(timezone.utc).isoformat())}",
             f"DTSTART:{start}", f"DTEND:{end}",
             f"SUMMARY:{esc(title)}", f"LOCATION:{esc(location)}",
             f"DESCRIPTION:{esc(details)}"]
    if cancelled:
        lines.append("STATUS:CANCELLED")
    lines += ["END:VEVENT", "END:VCALENDAR"]
    return "data:text/calendar;charset=utf-8," + urllib.parse.quote("\r\n".join(lines))

def main():
    mtgs = dome("/v1/committee-meetings").get("data", [])
    by_day = {}
    total = 0
    for m in mtgs:
        eid_m = re.search(r"EventId=(\d+)", m.get("url", "") or "")
        eid = eid_m.group(1) if eid_m else None
        start_iso, end_iso = m.get("startDate"), m.get("endDate")
        if not start_iso:
            continue
        st = datetime.fromisoformat(start_iso.replace("Z", "+00:00")).astimezone(ET)
        startUTC = utc_stamp(start_iso)
        endUTC = utc_stamp(end_iso) if end_iso else utc_stamp(
            (datetime.fromisoformat(start_iso.replace("Z", "+00:00")) + timedelta(hours=2)).isoformat())
        typ, typ_label = TYPE.get(m.get("meetingType"), ("meeting", "Meeting"))

        d = {}
        if eid:
            try:
                d = cg(f"committee-meeting/119/house/{eid}").get("committeeMeeting", {}) or {}
            except Exception:
                d = {}
        coms = [c.get("name") for c in (d.get("committees") or []) if c.get("name")]
        committee = short_com(coms[0] if coms else None)
        title = clean(d.get("title")) or f"{committee} {typ_label}"
        loc = d.get("location") or {}
        building = short_bldg(loc.get("building"))
        room = (building + (" " + str(loc.get("room")) if loc.get("room") else "")).strip() or "TBD"
        status = d.get("meetingStatus") or "Scheduled"
        cancelled = status.lower() in ("postponed", "cancelled", "canceled")
        witnesses = []
        for w in (d.get("witnesses") or [])[:8]:
            sub = " · ".join([x for x in [w.get("position"), w.get("organization")] if x])
            witnesses.append({"name": w.get("name") or "Witness", "sub": sub})
        docs = []
        for dd in (d.get("meetingDocuments") or [])[:6]:
            docs.append({"name": clean(dd.get("name") or dd.get("documentType") or "Document")[:60],
                         "url": dd.get("url") or ""})
        notice = f"https://docs.house.gov/Committee/Calendar/ByEvent.aspx?EventId={eid}" if eid else ""

        cal_loc = ", ".join([x for x in [room, "Washington, DC"] if x])
        details = title + "\n\n" + committee + (
            "\n\nWitnesses: " + "; ".join(w["name"] for w in witnesses) if witnesses else "")
        if notice:
            details += "\n\nOfficial notice: " + notice
        cal_title = f"{typ_label}: {title}"[:120]

        meeting = {
            "id": eid or startUTC,
            "time": st.strftime("%-I:%M %p"),
            "type": typ, "typeLabel": typ_label, "typeColor": COLOR[typ],
            "tag": ("Postponed" if cancelled else typ_label),
            "tagColor": ("#b23a32" if cancelled else COLOR[typ]),
            "committee": committee,
            "title": title,
            "dayDate": st.strftime("%a, %b %-d"),
            "room": room,
            "status": status,
            "statusLabel": status,
            "statusColor": ("#b23a32" if cancelled else "#2f7d4f"),
            "statusBg": ("#f6e3e1" if cancelled else "#e6f0e8"),
            "hasVideo": bool(d.get("videos")),
            "witnesses": witnesses, "hasWitnesses": bool(witnesses), "witnessCount": len(witnesses),
            "docs": docs, "hasDocs": bool(docs),
            "noticeUrl": notice, "hasNotice": bool(notice),
            "googleUrl": google_url(cal_title, startUTC, endUTC, cal_loc, details),
            "icsHref": ics_href(meeting_uid := (eid or startUTC), cal_title, startUTC, endUTC, cal_loc, details, cancelled),
        }
        key = st.strftime("%Y-%m-%d")
        by_day.setdefault(key, {"day": st.strftime("%a"), "dlabel": st.strftime("%b %-d"),
                                "key": key, "meetings": []})
        by_day[key]["meetings"].append(meeting)
        total += 1

    days = []
    for key in sorted(by_day):
        d = by_day[key]
        d["meetings"].sort(key=lambda x: x["id"])  # stable; times already grouped by day
        d["count"] = len(d["meetings"])
        days.append(d)
    week_label = "Week of " + (days[0]["dlabel"] if days else "")
    n = max(1, len(days))
    payload = {
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "weekLabel": week_label,
        "totalCount": total,
        "gridCols": f"grid-template-columns:repeat({n},minmax(0,1fr));",
        "days": days,
    }
    out = os.path.join(ROOT, "committee_schedule.js")
    with open(out, "w") as f:
        f.write("window.COMMITTEE_SCHEDULE = " + json.dumps(payload, ensure_ascii=False) + ";\n")
    print(f"Wrote {out}: {total} meetings across {len(days)} day(s) — {week_label}")

if __name__ == "__main__":
    main()
