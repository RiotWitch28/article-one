window.PRUDENCE_DATA = {
  "schema": "prudence-v2-lean",
  "bioguide": "F000484",
  "member_name": "Randy Fine",
  "generated_at": "2026-06-13",
  "generator": {
    "agent": "prudence-analyst-lean",
    "spec": "PRUDENCE_AGENT v2 (lean single-pass)",
    "mode": "lean — adversarial Review Chain (Advocate / Equity Auditor / Citation Verifier) NOT independently run; orchestrator performed combined party-flip, allegation, and per-person-inference self-checks in §self_checks"
  },
  "coverage": {
    "office_years": ["2025"],
    "campaign_range": "Active 2024 cycle FEC committee; 1,466 disbursement records totaling $2,955,591",
    "tenure_note": "Rep. Fine was sworn in April 1, 2025 after winning the FL-06 special election to replace Mike Waltz (resigned to serve as National Security Advisor). FY2025 is his first office year — approximately 9 months of MRA tenure. Office activity is correctly thin for a partial-year freshman office; this is not a finding.",
    "caveats": [
      "Single fiscal year only (FY2025, ~9 months). One-year claims only; no trend or churn analysis.",
      "Office personnel detail is capped at the top 30 individuals (22 of whom are Personnel Compensation); the office has 459 total line items in FY2025. No complete staff roster claim is possible from this data slice.",
      "Staff titles are not a clean field — they appear inside transaction 'purpose' text. Parsed approximately.",
      "No quarterly/period breakdown in this data slice → senior-role churn over quarters is not-assessable.",
      "Cross-office benchmark peer group is n=3 (single-year FY2025 members only); too small for percentile claims — comparisons are descriptive."
    ],
    "not_assessable": [
      { "check": "Senior-role churn over quarters", "reason": "No quarterly/period breakdown in the data slice." },
      { "check": "Senior-tier gender balance (aggregate)", "reason": "Gender is not present in the office personnel data; SOD records carry no demographic fields." },
      { "check": "Lens B — healthy-structure benchmark", "reason": "Peer-reviewed successful-workplace corpus has not yet been filed under _research/papers/workplace-structures/. Prudence will not reason from general knowledge in place of the required corpus (Charter §2.5, Spec §6.5)." },
      { "check": "Full vendor list comparison", "reason": "Office top_vendors list is empty in this data slice; only top_individuals are populated. Full vendor analysis requires the full disbursement records." }
    ]
  },
  "narrative_summary": {
    "headline": "A normally-structured freshman office, with two structural patterns worth a human's attention.",
    "body": "In nine months as a freshman office, Rep. Fine's MRA spending sits inside the normal envelope for a House Member: 22 staff, 83.1% of disbursements to personnel, two paid interns, and a vendor pattern that matches the rest of Congress — salaried staff on the official side, outside consultants on the campaign side. Two structural patterns stand out for human review. First: Chief of Staff Jason Fischer and Deputy Chief Marie Rogerson are paid at rates that cross the House senior-staff threshold triggering Financial Disclosure, Periodic Transaction Report, and post-employment requirements. The Statement of Disbursements shows the pay; it cannot show whether the corresponding filings exist on record. That is a question for a human reviewer — not a question about the salaries themselves, which are within House norms. Second: the top three staff account for 43% of personnel spending, higher than the two single-year peer offices (Bell at 29%, Friedman at 33%). The most likely innocent explanation — a freshman office that staffed its senior tier in its first quarters — is plausible, is stated in the finding itself, and is the reason the indicator is held at REVIEW rather than escalated. The indicator is set to be re-tested against FY2026 data. Nothing in this brief is an allegation. Everything is framed for a qualified human to verify, escalate, or close.",
    "synthesis_note": "This narrative is AI-synthesized from the three module analyses below, before a human reads any of them. It is not a verdict — it is Prudence's read of where a human reviewer's attention is best spent. The detailed findings, evidence, rule citations, and honest limits are in §2–§4."
  },
  "modules": {
    "rules_check": {
      "summary": "Two FY2025 senior staff are paid at or above the 'senior staff rate' that triggers House financial-disclosure, periodic-transaction-report, and post-employment requirements. This is a question about compliance filings, not about the salaries themselves — those are within House norms. One CLEAR result on the employee-ceiling check (within the top-30 sample). The official-side spending is dominated by personnel (83.1%), consistent with a normally-staffed Member office.",
      "findings": [
        {
          "id": "rc-1",
          "severity": "REVIEW",
          "title": "Two senior staff appear paid at rates triggering House Financial Disclosure / PTR / post-employment requirements — confirm filings are on record",
          "rule": {
            "doc": "Committee on Ethics — 2026 Annual Pay Memo (Jan. 30, 2026)",
            "section": "p. 2–3, 'Senior Staff and Post Employment Triggering Salaries' and 'Financial Disclosure'",
            "quote": "House officers and employees whose basic rate of pay is equal to or greater than 120 percent of the minimum rate of basic pay payable for GS-15 of the General Schedule for at least 60 days at any time during a calendar year are subject to financial disclosure filing requirements. … The applicable 120% calculation for that rate is therefore $151,661, or a monthly salary of equal to or more than $12,638. This rate is referred to as the 'senior staff rate.'  … any new employee paid at or above the senior staff rate must file a 'new employee' FD report within 30 days of assuming employment with the House."
          },
          "evidence": {
            "entity": "office",
            "items": [
              { "year": 2025, "payee": "FISCHER JASON",   "purpose": "CHIEF OF STAFF",         "amount": 190509.72, "n_txns": 81, "annualized_estimate": "$254,013 (≈9-month tenure)" },
              { "year": 2025, "payee": "ROGERSON MARIE",  "purpose": "DEPUTY CHIEF OF STAFF",  "amount": 114675.88, "n_txns": 31, "annualized_estimate": "$152,901 (≈9-month tenure)" }
            ],
            "rule_reference_values": {
              "cy2025_senior_staff_rate": 150160,
              "cy2026_senior_staff_rate": 151661,
              "source": "2026 Annual Pay Memo p. 3 (CY2025 figure stated in footnote / context); p. 2 (CY2026 table)"
            }
          },
          "analysis": "Both staffers' nine-month FY2025 totals annualize above the CY2025 senior-staff rate of $150,160. At those rates, House rules require: (a) a new-employee Financial Disclosure within 30 days of assuming employment, (b) annual FD reports thereafter, (c) Periodic Transaction Reports for certain financial trades, and (d) post-employment lobbying restrictions after they leave the House. The Statement of Disbursements cannot show whether those filings were made — that record lives with the Clerk of the House and the Committee on Ethics.",
          "options_for_human": [
            "Confirm with the office that the new-employee FD reports for these senior staff were filed within the 30-day window after April 2025 employment.",
            "Verify annual FD reports for CY2025 (due May 15, 2026) are on file with the Clerk.",
            "If either staffer has made covered securities transactions, confirm PTRs are filed within 30 days of becoming aware (or 45 days of transaction) per 5 U.S.C. § 13105(l)."
          ],
          "limits": "The SOD shows compensation paid but does not show whether the corresponding ethics filings exist. Confirming filings requires checking the Clerk's public FD database and the Ethics Committee's records.",
          "self_review": "single-pass — not independently challenged. Strongest innocent explanation considered: the salary itself is within House norms; this finding is about a *filing* obligation that may already be satisfied, in which case the human review closes immediately. The party-flip test passes — the same finding would be drafted identically for a Democratic freshman with the same staff structure."
        }
      ],
      "clear": [
        {
          "check": "Employee ceiling (2 U.S.C. § 5321: 18 permanent + 4 additional employees, max 22)",
          "note": "22 personnel observed in the top-30 sample, which is the legal ceiling counting any mix of permanent and additional categories. The sample does not distinguish permanent vs. intern/part-time/temporary/shared/LWOP, so the ceiling is mathematically not exceeded by the visible data. CLEAR within the top-30 window.",
          "rule_cited": "Members' Congressional Handbook (Sept. 12, 2025), 'Employees — Employee Ceiling' (p. 8)"
        },
        {
          "check": "Personnel share of MRA spend",
          "note": "Personnel = $881,646 of $1,061,011 total = 83.1%. This is normal for a Member office and falls within the range of single-year peers (Bell 81.7%, Friedman 83.0%)."
        }
      ]
    },
    "structure_screen": {
      "summary": "One descriptive structural indicator: pay is concentrated in the top of the office (Top-3 = 43.1% of personnel, vs. 29.4% and 33.3% for the two single-year peer offices). The most likely innocent explanation — a partial-year freshman office that staffed up the senior tier first — is plausible and the finding is held at REVIEW for that reason. Other Lens A checks return CLEAR-or-not-assessable. Lens B is not-assessable until the healthy-structure corpus is filed.",
      "benchmark": {
        "window": "FY2025 (single fiscal year, ~9 months for Fine)",
        "peers": 3,
        "peer_basis": "Single-year FY2025 members only — Fine (R, FL-06), Bell (D, MO-01), Friedman (D, CA-30). The other 10 members in the Article One set carry multi-year SOD coverage and are not window-comparable on concentration ratios in FY2025 alone.",
        "metrics": [
          { "name": "Personnel share of MRA", "fine": 0.831, "bell": 0.817, "friedman": 0.830, "comment": "Within the peer range." },
          { "name": "Top-1 personnel pay share", "fine": 0.216, "bell": 0.139, "friedman": 0.145, "comment": "Fine's top-1 share is higher than both peers." },
          { "name": "Top-3 personnel pay share", "fine": 0.431, "bell": 0.294, "friedman": 0.333, "comment": "Fine's top-3 share is higher than both peers." },
          { "name": "Personnel headcount in top-30", "fine": 22, "bell": 18, "friedman": 19, "comment": "Within peer range." },
          { "name": "Interns observed in top-30", "fine": 2, "bell": 0, "friedman": 0, "comment": "Two paid interns observed in Fine's office (Smith and Aylesworth)." }
        ],
        "small_n_caveat": "n=3 is too small for percentile claims. Read this as a descriptive comparison between three offices, not a benchmark against 'the average Member.'"
      },
      "risk_lens": {
        "indicators": [
          {
            "id": "ss-1",
            "severity": "REVIEW",
            "framework": "EEOC 2016 Risk Factors (significant power disparity) + CRS R46262 senior staff role benchmarks",
            "title": "Senior-tier pay concentration above single-year peers",
            "evidence": "Chief of Staff Jason Fischer received $190,510 across 81 FY2025 transactions = 21.6% of personnel spend; Top-3 (Fischer / Rogerson / Elizondo) = $380,047 = 43.1% of personnel. The two single-year peer offices show top-3 shares of 29.4% (Bell) and 33.3% (Friedman).",
            "analysis": "Concentration of pay in a senior tier is one of the structural conditions the EEOC's 2016 Select Task Force flagged as a risk indicator — not because concentration causes harassment, but because a structure where authority and rewards sit narrowly can make it harder for junior staff to escalate concerns and easier for misconduct to go unchallenged. This is a structural indicator for human review, not a claim about any individual's conduct or this office's culture.",
            "options_for_human": [
              "Read this in context of a 9-month freshman office that staffed its senior tier first; concentration may normalize as junior staff are added in FY2026.",
              "If the office wishes, confirm independent channels for junior-staff concerns (Office of Congressional Workplace Rights, House Employment Counsel) are communicated and accessible.",
              "Re-run this indicator after FY2026 SOD data is available to test whether concentration persists or normalizes."
            ],
            "limits": "Single year of data with partial-year tenure fully accounts for high concentration as an innocent explanation. Per-person comp figures are paid amounts over partial periods, not annualized base salaries. SOD has no role-tenure or churn data, so we cannot test whether the senior tier is stable or rotating.",
            "self_review": "single-pass — not independently challenged. Strongest innocent explanation considered AND stated in 'limits': a partial-year office staffed up the senior tier first; the metric should be re-tested after a full year. The finding is held at REVIEW (not NOTABLE) because that innocent explanation is plausible and the data window is one fiscal year. Party-flip test: the wording would be identical for a Democratic freshman with the same staffing pattern."
          },
          {
            "id": "ss-2",
            "severity": "CLEAR",
            "framework": "Members' Congressional Handbook (Employee Ceiling)",
            "title": "Paid interns present, within MRA framework",
            "evidence": "Two paid interns identified by purpose-text parsing in the top-30 sample (Smith and Aylesworth).",
            "analysis": "Paid interns are an explicit MRA-allowed category and a positive structural indicator for entry-level access to congressional offices. No concerns surfaced.",
            "limits": "Intern count from top-30 only; the office may have additional interns outside the top-30 sample."
          }
        ]
      },
      "health_lens": {
        "status": "not-assessable",
        "reason": "Healthy-structure corpus (peer-reviewed studies of successful workplace structures) has not yet been filed under _research/papers/workplace-structures/. Prudence does not reason from general knowledge in place of a required corpus (Charter §2.5; Spec §4.3 and §6.5).",
        "comparisons": []
      },
      "honest_limits": "The structure screen for FY2025 covers ~9 months of a freshman office at the top-30 personnel level. It cannot show: full headcount below the top 30, role tenure, hire/exit dates, demographic balance, or whether any senior-staff churn occurred. The single most material limit is the n=3 peer group — three single-year offices is a descriptive comparison, not a population benchmark. Re-running this module against FY2026 data and a larger peer set will produce a meaningfully stronger read."
    },
    "vendor_composition": {
      "summary": "Office side (MRA, $1.06M): heavily personnel — 83.1% to salaried staff, 16.9% to a small set of administrative, travel, communications, and consulting vendors. Campaign side ($2.96M across 1,466 records): visible top vendors are media and political-strategy firms (Strategic Media Placement, Big Dog Strategies, Go Big Media, The Coefficient Group, Republican Party of Florida). The classic 'official-W2 / campaign-consultant' structure is present here — and is structurally ordinary across Congress, not a finding of concern.",
      "split": [
        {
          "entity": "office",
          "people_share": 0.831,
          "orgs_share": 0.169,
          "people_amt": 881646.44,
          "orgs_amt": 179364.40,
          "note": "Top-30 personnel includes 22 salaried staff (the legal ceiling); non-personnel categories are Administrative, Travel, Consulting, Media, and Legal Services."
        },
        {
          "entity": "house_campaign",
          "people_share": null,
          "orgs_share": null,
          "note": "Per-payee totals in this data slice are zeroed; the visible top-vendor names are organizations (media/strategy LLCs and the state party), consistent with normal campaign-side structure. Detailed person-vs-org split requires the full FEC records."
        }
      ],
      "pattern_w2_consultant": {
        "present": true,
        "analysis": "Yes — Fine's office runs the structurally ordinary congressional setup: official-side work is done by salaried staff (Chief of Staff, Deputy CoS, Comms Director, District Director, LD, LAs, caseworker, scheduler, interns), and campaign-side work is done by outside vendors (media buyers, strategy firms, the state party). Almost every Member of Congress runs some version of this split because House rules require it — MRA funds cannot pay for campaign work, and campaign funds cannot duplicate official-office work.",
        "framing": "Prudence flags this pattern in every member's report because the goal of the composition screen is designing systems that lessen the chance of harmful environments — not because the pattern itself is suspicious. The W2/consultant structure is ordinary, often appropriate, and is NOT evidence of manipulation, abuse, or grooming. It is one consideration for a holistic human read, alongside who is making decisions, who is supervising work, and how concerns are escalated."
      },
      "findings": []
    }
  },
  "questions_for_human": [
    "Have new-employee Financial Disclosure reports been filed (within the 30-day window after April 2025 employment) for the two senior staff whose pay rates appear to trigger the requirement?",
    "Are CY2025 annual FD reports and any required PTRs on file with the Clerk of the House for those same senior staff?",
    "Will the senior-tier pay concentration observed in this 9-month window normalize after FY2026 data covers a full year and more junior staff are added — or persist as a structural feature of the office?",
    "Does the office wish to publicly note the independent channels available to junior staff (Office of Congressional Workplace Rights; House Employment Counsel) for concerns, given the concentration of authority in the senior tier during the office's first year?"
  ],
  "self_checks": {
    "party_flip": "PASS — re-read the entire output imagining Rep. Fine were a Democratic freshman who won a CA, NY, or IL special election in April 2025 with identical staffing. No wording, severity, emphasis, or inclusion decision changes. Every finding sits on numbers traced from the data file and rules quoted verbatim from House documents.",
    "allegation_scan": "PASS — no sentence states or implies misconduct, guilt, incompetence, or bad intent by any person. The only named individuals are named because the SOD names them publicly; no claim is made about their conduct, competence, or qualifications.",
    "per_person_inference": "PASS — no protected characteristic (gender, ethnicity, religion, age, etc.) is attached to any named person. The senior-tier gender-balance check was correctly marked not-assessable because gender is not in the source data.",
    "notes": "This analysis was produced by a single agent in one pass. The full Prudence pipeline (independent Advocate, Equity Auditor, and Citation Verifier subagents) was not run in this output. Read each finding's 'self_review' note for the strongest innocent explanation the single agent considered."
  },
  "disclaimers": {
    "rules_check": "🤖 Prudence — Generated analysis. Findings are an automated first-pass screen of public Statement-of-Disbursements data against the Members' Congressional Handbook and Committee on Ethics guidance; they are not legal advice and not an allegation of misconduct. Confirmation of any flagged item requires the underlying invoices, payroll authorizations, and Ethics Committee filings held by the office, the Clerk of the House, and the Committee on House Administration.",
    "structure_screen": "🤖 Prudence — Generated structural screen. Indicators are mapped from public Statement-of-Disbursements personnel data onto published organizational research (EEOC 2016; adult-grooming literature; CRS R46262; peer-reviewed workplace-structure studies where filed). They are risk indicators and structural comparisons for human review, not allegations, findings, or legal conclusions, and they make no claim about any named individual's conduct or competence.",
    "vendor_composition": "🤖 Prudence — Generated composition screen. The people-vs-organization split and any structural pattern shown are considerations for a holistic human read, not evidence of wrongdoing. Payee classification is automated from public payee names and may misclassify edge cases.",
    "lean_mode": "🤖 Prudence (lean mode) — This analysis was produced by a single agent in one pass; the adversarial Review Chain (independent Advocate, Equity Auditor, and Citation Verifier) was not run. Treat findings as a first screen with a lower confirmation bar than full Prudence output."
  },
  "attribution": "🤖 Prudence — AI decision-support system for the legislative branch. Suffrage and Sass · Article One. Prudence advises. The human decides. Always."
}
;
