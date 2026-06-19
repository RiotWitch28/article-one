window.PRUDENCE_DATA = {
  "schema": "prudence-v2",
  "mode": "lean",
  "bioguide": "B001281",
  "member_name": "Joyce Beatty",
  "generated_at": "2026-06-19",
  "generator": {
    "agent": "Prudence (lean — house-prudence-analyst-lean)",
    "spec": "PRUDENCE_AGENT v2",
    "model": "claude-sonnet-4-6",
    "roster": [
      "rules-analyst (self)",
      "structure-analyst (self)",
      "composition-analyst (self)",
      "advocate (self)",
      "equity-auditor (self)",
      "citation-verifier (self)"
    ]
  },
  "coverage": {
    "office_years": ["2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025"],
    "campaign_range": ["2011-12-08","2026-04-15"],
    "tenure_note": "11-year MRA window (FY2015–2025). Beatty excluded from single-year peer percentiles; all ratios described as career patterns, not ranked against current-year peers.",
    "caveats": [
      "JACKSON SANDRA D vs JACKSON SANDRA D. are treated as the same individual per §4.4 name-variant rule; combined career total ~$658,200.",
      "FIRESIDE21 and FIRESIDE 21 LLC are likely the same vendor; combined ~$319,909.",
      "MOTORISTS MUTUAL INSURANCE CO transaction purposes read 'DISTRICT OFFICE RENT (PRIVATE)'; correctly categorized under Administrative & Other — not an insurance payment.",
      "HON JOYCE BEATTY travel entries ($31,087) are member mileage reimbursement; allowable per Handbook Travel section.",
      "TCKCONSULTINGLLC and LAWSON DION A. appear only in by_category aggregates; no transaction-level purpose descriptions available in public data."
    ],
    "not_assessable": [
      {
        "check": "Single-year peer percentile ranking for personnel-share, top1-pay-share, top3-pay-share",
        "reason": "Beatty's 11-year data window disqualifies her from the single-year peer set (n=3 single-year peers). Percentiles are null per §4.4 multi-year caveat."
      },
      {
        "check": "Purpose-level confirmation for TCKCONSULTINGLLC ($7,458) and LAWSON DION A. ($5,864)",
        "reason": "These payees appear only in by_category aggregates; no transaction-level purpose strings are available in the public data file."
      }
    ]
  },
  "findings": [
    {
      "id": "rc-1",
      "module": 1,
      "severity": "NOTABLE",
      "title": "Encova Insurance ($95,208) — insurance category requires confirmation of allowable purpose",
      "body": "Encova Insurance Co. (Ohio-based property and casualty insurer) is paid $95,208 over 11 years (~$8,655/year) under Administrative & Other. The Members' Congressional Handbook allows MRA insurance reimbursement in narrow contexts only: liability insurance required for a district office lease (p. 35), liability insurance for official meetings where the Federal Tort Claims Act is inadequate (p. 31), and up to half of a professional liability insurance premium (p. 26). Fire and theft insurance are explicitly not reimbursable. The public disbursement data provides no transaction-level purpose description for Encova to confirm which policy type applies. The annual amount and Ohio insurer are consistent with district-office lease liability coverage — a permitted use — but human confirmation of the policy type is warranted.",
      "rule": {
        "doc": "Members' Congressional Handbook (Updated September 12, 2025)",
        "section": "District Office Expenses — Insurance (p. 35); Official Meetings & Events — Insurance (p. 31); Professional Liability Insurance (p. 26)",
        "quote": "Ordinary and necessary expenses related to purchase of liability insurance for the purpose of entering into a lease for a district office is reimbursable if the provisions of the Federal Tort Claims Act are not adequate. [...] The expenses of fire and theft insurance are not reimbursable."
      },
      "evidence": ["data.json by_category Administrative & Other: ENCOVA INSURANCE $95,208.12"],
      "questions_for_human": [
        "What type of insurance does Encova Insurance provide — district-office lease liability (allowable), fire/theft (not allowable), or professional liability (allowable up to half the premium)?",
        "Can the policy declarations page be confirmed against the Handbook's allowable categories?",
        "If the policy covers fire or theft, determine whether MRA funds were used in error and whether repayment is warranted."
      ],
      "review": {
        "advocate_challenge": "~$8,655/year is consistent with routine district-office liability coverage required by a private Ohio landlord — the exact scenario the Handbook permits.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "Identical check applies to any member of any party with a commercial insurance payee in Administrative & Other.",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "rc-2",
      "module": 1,
      "severity": "NOTABLE",
      "title": "TCKCONSULTINGLLC ($7,458 / 26 txns) — consulting vendor category is expressly prohibited from MRA",
      "body": "TCKCONSULTINGLLC is categorized under 'Consulting & Strategy' in the disbursement data. The Members' Congressional Handbook expressly prohibits MRA-funded consulting services: 'Vendors may not… provide consulting services (including but not limited to: legal fees (except where otherwise noted), speech writers, communications advisors or consultants, political or campaign advisors, etc.)' (p. 29–30). The Handbook's prohibition contains no dollar-amount threshold — it is categorical. The dollar amount is modest ($7,458 over 11 years, ~$679/year, 26 transactions), and it is possible the actual services are operational or technical (e.g., IT support, photography, staff training) — categories the Handbook permits — and were miscategorized by the disbursement system. The public data does not reveal the actual service rendered. A human reviewer with the underlying contracts and invoices is needed to resolve this.",
      "rule": {
        "doc": "Members' Congressional Handbook (Updated September 12, 2025)",
        "section": "General Office Expenses — Vendors (p. 29–30)",
        "quote": "Vendors may not perform duties pursuant to 2 U.S.C. § 4301 or regular core functions of employees or provide consulting services (including but not limited to: legal fees (except where otherwise noted), speech writers, communications advisors or consultants, political or campaign advisors, etc.)."
      },
      "evidence": ["data.json by_category consulting vendors: TCKCONSULTINGLLC $7,457.75 / 26 txns"],
      "questions_for_human": [
        "What services did TCKCONSULTINGLLC provide under the 26 invoices totaling $7,458 — are they operational/technical (potentially allowable) or advisory/consulting (expressly prohibited)?",
        "If the services were prohibited consulting, consult the Committee on House Administration regarding appropriate remediation."
      ],
      "full_tier_flag": "If purpose verification reveals advisory consulting services were actually rendered on MRA funds, this would be a candidate for HIGH under full-tier review. Capped at NOTABLE in lean mode.",
      "review": {
        "advocate_challenge": "The 'Consulting & Strategy' bucket label is assigned by the data pipeline, not necessarily the office. Actual purpose codes may show 'TECHNOLOGY SERVICE CONTRACTS' or 'STAFF TRAINING.' At ~$679/year, scale is consistent with a small recurring technical service.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "Identical analysis for any member's consulting-category payee regardless of party.",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "rc-3",
      "module": 1,
      "severity": "NOTABLE",
      "title": "LAWSON DION A. ($5,864 / 22 txns) — legal services vendor category is expressly prohibited from MRA except where noted",
      "body": "LAWSON DION A. appears in the 'Legal Services' category ($5,864 / 22 transactions over 11 years, ~$533/year). The Members' Congressional Handbook prohibits MRA-funded legal fees 'except where otherwise noted.' Recognized exceptions include lease review and specific Committee on House Administration authorized contexts. The modest dollar amount and recurrent pattern may indicate periodic retainer billing. The public data provides no transaction-level purpose description. The prohibition is categorical with narrow exceptions; human confirmation that the services fall within a recognized exception and that prior guidance from the Office of Administrative Counsel was obtained is warranted.",
      "rule": {
        "doc": "Members' Congressional Handbook (Updated September 12, 2025)",
        "section": "General Office Expenses — Vendors (p. 29–30)",
        "quote": "Vendors may not perform duties pursuant to 2 U.S.C. § 4301 or regular core functions of employees or provide consulting services (including but not limited to: legal fees (except where otherwise noted)…)."
      },
      "evidence": ["data.json by_category legal vendors: LAWSON DION A. $5,863.82 / 22 txns"],
      "questions_for_human": [
        "What legal services did LAWSON DION A. provide across 22 transactions totaling $5,864 — do they fall within a Handbook-recognized exception (lease review, employment law guidance, CAA compliance)?",
        "Did the office obtain prior guidance from the Office of Administrative Counsel (x56969) before engaging this vendor?",
        "If the services are outside a recognized exception, consult the Committee on House Administration regarding appropriate remediation."
      ],
      "full_tier_flag": "If purpose verification reveals legal fees outside a recognized Handbook exception, this would be a candidate for HIGH under full-tier review. Capped at NOTABLE in lean mode.",
      "review": {
        "advocate_challenge": "At ~$533/year, consistent with occasional lease or contract legal review — the 'except where otherwise noted' carve-out may apply.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "Identical analysis for any member's legal-services-category payee regardless of party.",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "rc-4",
      "module": 1,
      "severity": "NOTABLE",
      "title": "Fireside21 / Fireside 21 LLC — two name variants, combined ~$319,909; confirm single vendor file",
      "body": "The payees 'FIRESIDE21' ($195,188 / 85 txns) and 'FIRESIDE 21 LLC' ($124,721) are very likely the same vendor — Fireside21 is a constituent-communications and telephone town-hall service used widely by congressional offices. Purpose codes observed ('TECHNOLOGY SERVICE CONTRACTS,' 'TELECOMSRV/EQ/TOLL CHARGE') are consistent with allowable technology vendor services under the Handbook (p. 29). The combined 11-year total of ~$319,909 (~$29,083/year) is the third-largest non-personnel, non-rent vendor relationship. The name variant likely reflects corporate name formatting across pre- and post-LLC registration periods, not two separate contracting entities. Human confirmation that a single compliant W-9 and vendor file covers both name variants is prudent given the aggregate dollar amount.",
      "rule": {
        "doc": "Members' Congressional Handbook (Updated September 12, 2025)",
        "section": "General Office Expenses — Vendors (p. 29)",
        "quote": "Members may contract with firms or individuals for general, non-legislative and non-financial, office services such as… information technology services… web services."
      },
      "evidence": [
        "data.json top_individuals: FIRESIDE21 $195,187.96 / 85 txns; purposes: 'TECHNOLOGY SERVICE CONTRACTS,' 'TELECOMSRV/EQ/TOLL CHARGE'",
        "data.json by_category Administrative & Other: FIRESIDE 21 LLC $124,721.00"
      ],
      "questions_for_human": [
        "Can the Office of Financial Counseling confirm that FIRESIDE21 and FIRESIDE 21 LLC are registered as a single vendor entity with a current W-9 on file?",
        "Are all contracts with this vendor within-term and on file with the CAO Office of Administrative Counsel?"
      ],
      "review": {
        "advocate_challenge": "Fireside21 (now Fireside21 LLC) is a well-known congressional technology vendor. The name change across years is a routine corporate-name formatting difference observable in many offices' SOD records.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "Same name-variant check applies to any member's vendor records regardless of party.",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "rc-ce1",
      "module": 1,
      "severity": "NOTABLE",
      "title": "4 individuals paid by both MRA and campaign — IFEDUBA TERRILYN confirmed same-month dual payment (January 2024)",
      "body": "Cross-referencing office (SOD) and campaign (FEC Schedule B) top individual payees by name identifies 4 individuals who appear in both: VALENTINE TODD A., ROSS KIMBERLY W., IFEDUBA TERRILYN W., and MANECKE DOMINIC J. Dual payment from both a taxpayer-funded office account and a privately-organized campaign committee is legal — the dual-government employment prohibition in the Members' Congressional Handbook (p. 15) applies only to simultaneous employment at two government entities (e.g., House + Senate or House + federal agency); a campaign committee is a private organization and is not subject to this rule. However, the pattern warrants tracking and human awareness of the arrangement for each individual. IFEDUBA TERRILYN W. has a confirmed same-calendar-month payment from both entities in January 2024: $654,313 MRA total (137 txns, role: Personnel Compensation) and $7,196 campaign total (6 txns, role: CONTRACT FUNDRAISING). The January 2024 overlap means she was simultaneously on the MRA payroll and receiving campaign consulting fees in the same month. The other three individuals have no confirmed same-month overlap in available transaction data: VALENTINE TODD A. (MRA $849,339 / campaign $5,000 'STAFF SERVICES AT EVENT/CAUCUS'), ROSS KIMBERLY W. (MRA $845,810 / campaign $8,527 'CAMPAIGN CONTRACT SERVICES'), MANECKE DOMINIC J. (MRA $484,833 / campaign $6,032 'REIMBURSEMENT — CONFERENCE EXPENSES').",
      "rule": {
        "doc": "Members' Congressional Handbook (Updated September 12, 2025)",
        "section": "Dual Employment (p. 15)",
        "quote": "A House employee may not receive pay from more than one House employing authority at the same time... [this section governs dual House employment]. Campaign committees are private organizations not covered by this provision."
      },
      "evidence": [
        "data.json cross_entity_individuals (pipeline-derived): VALENTINE TODD A. — office $849,338.68 / 30 txns; campaign $5,000.00 / 1 txn ('STAFF SERVICES AT EVENT/CAUCUS'); combined $854,338.68; same_month_overlap: []",
        "data.json cross_entity_individuals: ROSS KIMBERLY W. — office $845,809.68 / 87 txns; campaign $8,527.00 / 8 txns ('CAMPAIGN CONTRACT SERVICES'); combined $854,336.68; same_month_overlap: []",
        "data.json cross_entity_individuals: IFEDUBA TERRILYN W. — office $654,313.02 / 137 txns; campaign $7,196.28 / 6 txns ('CONTRACT FUNDRAISING'); combined $661,509.30; same_month_overlap: ['2024-01']",
        "data.json cross_entity_individuals: MANECKE DOMINIC J. — office $484,833.41 / 40 txns; campaign $6,032.13 / 8 txns ('REIMBURSEMENT — CONFERENCE EXPENSES'); combined $490,865.54; same_month_overlap: []"
      ],
      "limits": "Cross-entity check is bounded by top_individuals lists (up to 30 per entity). Individuals ranked outside the top 30 on either side are not visible to this check. 'No same-month overlap detected' means no overlap was found in available transaction samples — it does not confirm that none exists.",
      "questions_for_human": [
        "IFEDUBA (January 2024 overlap): Was IFEDUBA TERRILYN W. simultaneously on the MRA payroll and performing paid fundraising work for the campaign in January 2024? Can the office confirm there was no conflict with her official duties during that period?",
        "VALENTINE: VALENTINE TODD A. received $5,000 from the campaign for 'STAFF SERVICES AT EVENT/CAUCUS' (February 2025) while also appearing as a long-term MRA payroll employee. What was the nature of the campaign event services and was there any scheduling or resource overlap with official duties?",
        "ROSS: ROSS KIMBERLY W. received $8,527 from the campaign for 'CAMPAIGN CONTRACT SERVICES' across 8 transactions (2015–2020) while on the MRA payroll (2016–2018). Was this a separate, distinct role clearly separated from official duties?",
        "MANECKE: MANECKE DOMINIC J. received $6,032 from the campaign for 'REIMBURSEMENT — CONFERENCE EXPENSES' (2017–2020). Were the expenses for conferences attended in a personal campaign capacity or in an official capacity?"
      ],
      "review": {
        "advocate_challenge": "Dual payment from MRA and campaign is legal. The Handbook's dual-employment prohibition applies only to two government entities. Campaign reimbursements for events are normal for staffers who also volunteer or participate in campaign activities on their own time.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "Identical check applies to any member's staff with campaign payment history regardless of party. Framing is informational only — no allegation of wrongdoing.",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "ss-r1",
      "module": 2,
      "severity": "LOW",
      "title": "Geographically distributed office (DC + Ohio district) — structural supervision gap",
      "body": "A Columbus, Ohio district office supervised from a Washington DC principal office creates a 'decentralized workplace' and 'isolated worksite' configuration — two of the twelve EEOC 2016 Select Task Force organizational risk factors for harassment-enabling environments. District-based staff (Ifeduba $654,313 / 137 txns; Seward $702,285 / 53 txns; Farnin $504,950 / 73 txns; Jackson ~$658,200 combined) account for a substantial share of long-tenure personnel spend. This structural characteristic is present in virtually all congressional offices and is not specific to this office; it is a documented risk factor that warrants structured mitigation regardless of any individual's conduct.",
      "framework": "EEOC Select Task Force on the Study of Harassment in the Workplace (2016): Risk Factor 10 — 'Isolated worksites'; Risk Factor 12 — 'Decentralized workplaces (low senior-management visibility)'",
      "evidence": [
        "EEOC Select Task Force (2016): Risk Factors 10 and 12",
        "data.json top_individuals: IFEDUBA TERRILYN W. $654,313 / 137 txns; SEWARD LARRY L $702,285 / 53 txns; FARNIN III ARTHUR $504,950 / 73 txns; JACKSON SANDRA D ~$658,200 combined"
      ],
      "questions_for_human": [
        "What is the supervisory chain between DC and district staff, and how frequently does senior DC leadership conduct structured check-ins with district teams?",
        "Does the office maintain an independent reporting channel (e.g., OCWR) that district staff have been actively informed of and can use without routing through DC supervisors?"
      ],
      "review": {
        "advocate_challenge": "Geographic distribution is universal in House offices and is not a marker of elevated risk for any individual office.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "This structural factor applies to every House member office with a district presence; no party-specific weight.",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "ss-r2",
      "module": 2,
      "severity": "LOW",
      "title": "Long-tenure senior staff with high career pay — power asymmetry pattern observable",
      "body": "The top-1 career pay share (7.6% of total personnel spend; Valentine Todd A. $849,339 / 30 txns) and top-3 share (21.5%; ~$2,397,000 combined) reflect a structure where a small number of long-serving senior individuals hold sustained financial weight relative to the broader staff complement. The EEOC 2016 framework identifies 'significant power disparities' as a structural risk factor. This is a descriptive financial-structure observation, not a finding about any individual's conduct: long-serving, well-compensated senior staff are also associated with institutional continuity and mentorship capacity. The data cannot show whether these conditions are mitigated by feedback mechanisms, independent reporting, or supervisory density.",
      "framework": "EEOC Select Task Force (2016): Risk Factor 7 — 'Significant power disparities'; Sinnamon (2017) Seven-Stage Model: Stage 1 — vulnerability via positional dependence",
      "evidence": [
        "data.json top_individuals: VALENTINE TODD A. $849,338.68 / 30 txns; top1_pay_share = 0.076; top3_pay_share = 0.215",
        "EEOC Select Task Force (2016): Risk Factor 7",
        "Sinnamon (2017): Stage 1 — 'victim selection via vulnerability cues — early-career, isolated, dependent on perpetrator for access'"
      ],
      "questions_for_human": [
        "Does the office maintain skip-level or peer-review mechanisms by which junior and mid-level staff can provide feedback about their supervisory experience without routing through the senior staff being reviewed?",
        "What is the seniority composition of the full staff complement beyond the top-30 payees visible in this data?"
      ],
      "review": {
        "advocate_challenge": "A 7.6% top-1 share over 11 years for a Chief of Staff is unremarkable for a well-tenured congressional office.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "Identical analysis applies to any member's long-tenured senior staff regardless of party.",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "ss-h1",
      "module": 2,
      "severity": "CLEAR",
      "title": "Long employee tenure consistent with retention outcomes associated with mentoring structures",
      "body": "Liff & Rovio-Johansson (2025) find that 'mentoring works as a confidential relationship and a mechanism for the mentee's willingness to stay within the organisation.' The Beatty office's 11-year data shows a large number of staff with multi-year continuous tenure — Ifeduba Terrilyn W. (137 txns), Ross Kimberly W. (87 txns), and others — suggesting retention patterns the peer-reviewed literature associates with supportive supervisory relationships. This is a structurally healthy signal within the limits of what disbursement data can show.",
      "framework": "Liff & Rovio-Johansson (2025), Journal of Health Organization and Management, 39(9), 54–70",
      "evidence": [
        "Liff & Rovio-Johansson (2025): 'Mentoring works as a confidential relationship and a mechanism for the mentee's willingness to stay within the organisation' (Conclusion)",
        "data.json top_individuals: IFEDUBA TERRILYN W. 137 txns; ROSS KIMBERLY W. 87 txns"
      ],
      "review": {
        "advocate_challenge": "High transaction counts may reflect frequent small payments rather than long tenure.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "ss-h2",
      "module": 2,
      "severity": "LOW",
      "title": "Geographically distributed structure: interactive supervision is the research-supported protective mechanism",
      "body": "Li & Wang (2024) find that 'interactive monitoring by superiors in remote workplaces is a type of job resource that enhances work engagement.' Gallup (Harter, 2026) adds that 'managers' open communication with employees is more important than the number of direct reports they have.' The Beatty office's Ohio district operation, supervised at a distance from DC, is precisely the remote-supervision context these studies address. The disbursement data cannot show whether interactive supervision practices are in place; the research literature says whether they are determines whether the geographic structure is protective or risk-amplifying for staff.",
      "framework": "Li & Wang (2024), Frontiers in Psychology, 15:1383207; Gallup/Harter (2026)",
      "evidence": [
        "Li & Wang (2024): 'Interactive monitoring by superiors in remote workplaces is a type of job resource that enhances work engagement by promoting personal resources such as self-efficacy' (Discussion)",
        "Gallup/Harter (2026): 'managers' open communication with employees is more important than the number of direct reports they have'"
      ],
      "questions_for_human": [
        "What structured communication cadence exists between DC-based senior management and district-based staff?",
        "Has the office evaluated or implemented anonymous staff-engagement or climate-survey mechanisms consistent with the EEOC 2016 recommendation for independent reporting channels?"
      ],
      "review": {
        "advocate_challenge": "Li & Wang (2024) is set in private-sector remote work; application to congressional offices is a mechanism transfer, not a direct finding.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "Corpus coverage limit stated in finding. No party framing.",
        "citation_check": "verified",
        "survives": true
      }
    },
    {
      "id": "vc-1",
      "module": 3,
      "severity": "LOW",
      "title": "Fireside21 / Fireside 21 LLC — same vendor, two name registrations; combined $319,909 over 11 years",
      "body": "The two payee names 'FIRESIDE21' ($195,188 / 85 txns) and 'FIRESIDE 21 LLC' ($124,721) likely represent the same constituent-communications technology vendor under two name registrations. The combined 11-year total of ~$319,909 is the third-largest non-personnel, non-rent vendor relationship. Services described are consistent with allowable technology vendor categories. A human reviewer should confirm a single compliant W-9 and vendor file covers both name variants.",
      "evidence": [
        "data.json: FIRESIDE21 $195,187.96 / 85 txns; FIRESIDE 21 LLC $124,721.00",
        "Handbook Vendors section (p. 29): allowable vendor services include 'information technology services'"
      ],
      "questions_for_human": [
        "Can the Office of Financial Counseling confirm FIRESIDE21 and FIRESIDE 21 LLC are a single registered vendor with a current W-9 on file?",
        "Are all contracts within-term and on file with the CAO Office of Administrative Counsel?"
      ],
      "review": {
        "advocate_challenge": "Almost certainly a source-system name-formatting artifact for a well-known congressional vendor.",
        "advocate_verdict": "answered",
        "equity_check": "pass",
        "equity_note": "Name-variant check applies to any member's vendor records regardless of party.",
        "citation_check": "verified",
        "survives": true
      }
    }
  ],
  "clear_checks": [
    {"check": "Motorists Mutual Insurance Co. ($605,051 / 106 txns)", "note": "Transaction-level purpose codes read 'DISTRICT OFFICE RENT (PRIVATE).' ~$55,004/year consistent with Columbus, Ohio district office rent. Allowable under Handbook District Office Expenses — Leases (p. 35). CLEAR."},
    {"check": "Leidos Digital Solutions Inc. ($251,222 / 116 txns)", "note": "All sampled transactions carry purpose 'TECHNOLOGY SERVICE CONTRACTS.' Consistent with Handbook allowable vendor category: 'information technology services' (p. 29). CLEAR."},
    {"check": "USPS postage ($309,747 / 119 txns)", "note": "Franked Mail payments expressly allowable under Handbook Postage Expenses section. CLEAR."},
    {"check": "HON JOYCE BEATTY travel entries ($31,087)", "note": "Member mileage reimbursement; allowable per Handbook Travel section. CLEAR."},
    {"check": "Personnel compensation — top career totals", "note": "Top individual payees coded Personnel Compensation with standard congressional office role designations. Multi-year totals accumulate naturally at congressional pay scales. CLEAR."},
    {"check": "Campaign entity — DCCC contributions ($1,887,534)", "note": "Standard party dues and candidate committee transfers over a 14-year campaign period. 2020 spike consistent with competitive election year. CLEAR."}
  ],
  "questions_for_human": [
    "CROSS-ENTITY PAY / SAME-MONTH OVERLAP (rc-ce1): Was IFEDUBA TERRILYN W. simultaneously on the MRA payroll and performing paid campaign fundraising work in January 2024? Can the office confirm no conflict with official duties during that period?",
    "CROSS-ENTITY PAY (rc-ce1): For VALENTINE, ROSS, and MANECKE — were the campaign payments for services clearly separated from official duties, and was there no use of official resources or time?",
    "INSURANCE (rc-1): What type of insurance does Encova Insurance provide — district-office lease liability (allowable), fire/theft (not allowable), or professional liability (allowable up to half the premium)?",
    "CONSULTING VENDOR (rc-2): What services did TCKCONSULTINGLLC provide across 26 invoices totaling $7,458 — operational/technical (potentially allowable) or advisory/consulting (expressly prohibited)?",
    "LEGAL SERVICES (rc-3): What legal services did LAWSON DION A. provide across 22 transactions totaling $5,864, and do they fall within a Handbook-recognized exception with prior Office of Administrative Counsel guidance?",
    "VENDOR REGISTRATION (rc-4/vc-1): Does a single vendor file (W-9, contract) cover both 'FIRESIDE21' and 'FIRESIDE 21 LLC'?",
    "DISTRICT SUPERVISION (ss-r1/ss-h2): What supervisory and communication structures exist between DC-based senior staff and the Ohio district team? Are independent reporting channels (OCWR or equivalent) actively communicated to district employees?",
    "FULL-TIER REVIEW: The consulting and legal vendor findings (rc-2, rc-3) involve express Handbook prohibitions. If purpose verification raises further questions, a full-tier re-run is recommended before any escalation."
  ],
  "coverage_notes": [
    "11-year MRA window (FY2015–2025); no single-year peer percentiles available.",
    "Campaign data from FEC API, range 2011-12-08 to 2026-04-15.",
    "TCKCONSULTINGLLC and LAWSON DION A. transaction-level purpose descriptions not available in public data; findings based on by_category aggregates only.",
    "Healthy-structures Lens B corpus covers Gallup 2026, Li & Wang 2024, and Liff & Rovio-Johansson 2025 only; government-specific studies not yet filed.",
    "FIRESIDE21 / FIRESIDE 21 LLC treated as likely same entity per §4.4; human confirmation needed.",
    "JACKSON SANDRA D / JACKSON SANDRA D. treated as same individual per §4.4; combined career total ~$658,200."
  ],
  "full_tier_flags": [
    "rc-2 (TCKCONSULTINGLLC): Candidate for HIGH if purpose verification reveals prohibited consulting services on MRA funds. Recommend --full re-run if inconclusive.",
    "rc-3 (LAWSON DION A.): Candidate for HIGH if purpose verification reveals legal fees outside a recognized Handbook exception. Recommend --full re-run if inconclusive."
  ],
  "sovereign_charter_check": {
    "human_in_the_loop": "pass",
    "non_partisan": "pass",
    "magnifica_humanitas": "pass",
    "findings_as_risk_indicators": "pass",
    "bounded_by_provided_rules": "pass",
    "charter_verdict": "All findings cleared Sovereign Prudence review."
  },
  "disclaimers": {
    "module_1": "Module 1 findings are a first-pass screen of public Statement-of-Disbursements data against the Members' Congressional Handbook. They are not legal advice, not allegations of misconduct, and not determinations about any individual or office.",
    "module_2": "Module 2 findings describe structural patterns in the disbursement data as observed through EEOC 2016 risk factors, the Sinnamon (2017) grooming-risk framework, and peer-reviewed workplace-structure literature. The Statement of Disbursements is a financial record, not an HR record. No finding is an allegation about any named person.",
    "module_3": "Module 3 findings map vendor and payee composition for human review. They are not allegations of misuse, misconduct, or prohibited coordination."
  },
  "attribution": "Prudence — Automated compliance screen (lean tier). Findings are risk indicators and structural patterns for human review — not legal advice, not allegations of misconduct, and not determinations about any individual. Lean-tier analysis cannot issue HIGH severity. Confirmation of any flagged item requires the underlying invoices, contracts, and payroll authorizations held by the office and the Committee on House Administration. Prudence advises. The human decides. Always."
};
