export const brand = {
  name: "BIG",
  tagline: "Transparent Investment & Earning Plan",
  motto: "Invest with clarity. Earn with structure.",
  pillars: ["Invest", "Earn", "Withdraw", "Grow"] as const,
  visionLine: "Small Entry. Serious Structure.",
};

export const hero = {
  headlineLine1: "Invest 100 USD.",
  headlineLine2: "Earn every month.",
  body: "BIG gives every member the same simple opportunity — a low entry point, a consistent monthly return, and a compensation plan that rewards both trading income and team growth. Every number is published on this page.",
  primaryCta: "How You Earn",
  secondaryCta: "Investment Terms",
  stats: [
    { value: "100", unit: "USD", label: "Minimum Investment" },
    { value: "10–12", unit: "%", label: "Monthly ROI" },
    { value: "5", unit: "%", label: "Direct Commission" },
    { value: "20", unit: "Levels", label: "Team Income Depth" },
  ],
};

export const packageTerms = {
  eyebrow: "Investment Package",
  title: "One package. Four terms. No ambiguity.",
  intro:
    "Everything a member needs to know before joining is written here in plain numbers. There are no hidden tiers, no minimum rank, and no compulsory add-ons.",
  terms: [
    {
      label: "Minimum Investment",
      value: "100 USD",
      note: "The entry point for any new member. Additional top-ups can be made at any time.",
    },
    {
      label: "Monthly ROI",
      value: "10% – 12%",
      note: "Trade income is generated and distributed to the member every month, based on platform trading performance.",
    },
    {
      label: "Promoter Earning Cap",
      value: "Up to 5x",
      note: "A promoter can earn up to 5x of their initial investment in total earnings. Once this limit is reached, a top-up is required to continue earning.",
    },
    {
      label: "Team Income Depth",
      value: "20 Levels",
      note: "Level income is calculated on the trade income generated across 20 levels of your downline.",
    },
  ],
  howItWorks: {
    title: "How a monthly cycle runs",
    steps: [
      {
        title: "Member invests",
        detail: "A new member activates their account with a minimum investment of 100 USD.",
      },
      {
        title: "Platform trades",
        detail: "Funds are deployed into the trading system, which generates trade income for the month.",
      },
      {
        title: "Income is credited",
        detail: "Monthly ROI is credited to the member, and level income is shared across the upline.",
      },
      {
        title: "Member withdraws",
        detail: "Funds can be withdrawn from 10 USD onwards, subject to the published withdrawal rules.",
      },
    ],
  },
  projection: {
    title: "Illustrative 6-month projection",
    subtitle: "100 USD invested · 10% (floor) to 12% (target) monthly return",
    note: "Projection is for illustration only. Actual returns depend on live trading performance and are never guaranteed.",
    floorRate: 10,
    targetRate: 12,
    months: [0, 1, 2, 3, 4, 5, 6],
  },
  caps: [
    {
      title: "Before the cap",
      detail:
        "Promoters earn monthly ROI plus direct and level income from their team, until total earnings reach 5x their initial investment.",
      state: "earning",
    },
    {
      title: "At 5x — the cap",
      detail:
        "Earnings stop accumulating. The investment balance stays intact and remains fully withdrawable.",
      state: "capped",
    },
    {
      title: "Top-Up to resume",
      detail:
        "A promoter re-invests to unlock a fresh earning cycle and continue receiving income from the network.",
      state: "topup",
    },
  ],
};

export const withdrawal = {
  eyebrow: "Withdrawal Rules",
  title: "Four rules, applied every time.",
  intro:
    "Withdrawals are processed against a fixed and public schedule. There are no discretionary holds once these conditions are met.",
  rules: [
    {
      label: "Minimum Withdrawal",
      value: "10 USD",
      detail: "The lowest amount that can be requested in a single withdrawal.",
    },
    {
      label: "Withdrawal Fee",
      value: "5%",
      detail: "A processing fee of 5% is deducted from every withdrawal request.",
    },
    {
      label: "Exit Deduction — Before 6 Months",
      value: "10%",
      detail: "Withdrawals requested before the 6-month mark carry a 10% deduction on the amount.",
    },
    {
      label: "Exit Deduction — After 6 Months",
      value: "0%",
      detail: "After 6 months, no deduction applies and funds can be withdrawn freely.",
    },
  ],
  timeline: {
    phaseOne: {
      window: "Month 0 – 6",
      title: "Early Exit Window",
      fee: "10% deduction",
      detail:
        "Exiting during the first six months means a 10% deduction is applied to the withdrawn principal. Monthly ROI earned during this period remains with the member.",
      tone: "restricted",
    },
    phaseTwo: {
      window: "Month 6 onwards",
      title: "Open Withdrawal Period",
      fee: "No deduction",
      detail:
        "Once six months have passed, members withdraw freely without any early-exit penalty. Only the standard 5% processing fee applies.",
      tone: "open",
    },
  },
  feeNote:
    "The 5% processing fee and any applicable early-exit deduction are shown transparently before every withdrawal is confirmed.",
};

export const earnings = {
  eyebrow: "Earning Structure",
  title: "Two ways to earn inside BIG.",
  intro:
    "Income comes from two independent streams. Direct income is generated the moment a referral invests. Level income is generated continuously from the trade income of your downline.",
  streams: [
    {
      id: "direct",
      index: "01",
      name: "Direct Income",
      rate: "5%",
      rateLabel: "of referred investment",
      summary:
        "Refer a new member, and you earn 5% of their investment amount the moment they join and fund their account.",
      points: [
        "Credited instantly on the referred member's first investment.",
        "Applies to every direct referral you personally introduce.",
        "Independent of how many levels your referral later builds.",
      ],
      meta: [
        { k: "Trigger", v: "Referral invests" },
        { k: "Basis", v: "Investment amount" },
        { k: "Rate", v: "5%" },
      ],
    },
    {
      id: "level",
      index: "02",
      name: "Level Income",
      rate: "20 levels",
      rateLabel: "deep downline coverage",
      summary:
        "When members in your team generate trade income, you receive a percentage of it based on your level in their network.",
      points: [
        "Calculated on trade income only — not on investment amounts.",
        "Paid across 20 levels, from your closest referral to the deepest.",
        "Combines with direct income — both streams run at the same time.",
      ],
      meta: [
        { k: "Trigger", v: "Downline income" },
        { k: "Basis", v: "Trade income" },
        { k: "Depth", v: "20 levels" },
      ],
    },
  ],
  ladder: {
    eyebrow: "Level Income Table",
    title: "Percentage of downline trade income",
    subtitle:
      "Your level is counted by distance: the member you referred is Level 1, their referral is Level 2, and so on up to Level 20.",
    rows: [
      { level: "Level 1", rate: 20, label: "Your direct referral" },
      { level: "Level 2", rate: 10, label: "Referral of your referral" },
      { level: "Level 3", rate: 7.5, label: "Third generation" },
      { level: "Level 4", rate: 5, label: "Fourth generation" },
      { level: "Level 5", rate: 2.5, label: "Fifth generation" },
      { level: "Level 6 – 10", rate: 1, label: "Sixth to tenth generation" },
      { level: "Level 11 – 20", rate: 0.5, label: "Eleventh to twentieth generation" },
    ],
    footerNote:
      "Level income accrues only while the downline member remains active and trading.",
  },
};

export const workedExample = {
  eyebrow: "Worked Example",
  title: "How the money actually moves.",
  intro:
    "The example below follows three members from investment through team income. It uses 100 USD investments and 10 USD of monthly trade income per member so every figure is easy to verify.",
  assumptions: [
    { k: "Investment per member", v: "100 USD" },
    { k: "Monthly trade income per member", v: "10 USD" },
    { k: "Total trades per month", v: "2 signals" },
  ],
  steps: [
    {
      index: "01",
      tag: "Step 1",
      title: "Direct Income",
      summary: "The referral commission is paid on investment, instantly.",
      lines: [
        { text: "Member A joins and invests 100 USD.", tone: "plain" },
        { text: "Member A refers Member B.", tone: "plain" },
        {
          text: "Member B invests 100 USD → Member A receives 5% direct commission = 5 USD.",
          tone: "highlight",
        },
      ],
    },
    {
      index: "02",
      tag: "Step 2",
      title: "Level Income",
      summary: "Team income is paid on trade income, not on investment.",
      lines: [
        { text: "Member B begins trading and earns 10 USD of trade income for the month.", tone: "plain" },
        {
          text: "Member A sits at Level 1 to Member B → 20% of 10 USD = 2 USD.",
          tone: "highlight",
        },
        { text: "Member B refers Member C and earns 20% of C's trade income at Level 1.", tone: "plain" },
        {
          text: "Member A moves to Level 2 to Member C → 10% of 10 USD = 1 USD.",
          tone: "highlight",
        },
        { text: "This continues down the network for 20 levels.", tone: "plain" },
      ],
    },
  ],
  tree: {
    members: [
      { id: "A", label: "Member A", role: "Top of this example", invested: "100 USD", earned: "8 USD", tone: "root" },
      { id: "B", label: "Member B", role: "Referred by A · Level 1", invested: "100 USD", earned: "7 USD", tone: "mid" },
      { id: "C", label: "Member C", role: "Referred by B · Level 2 from A", invested: "100 USD", earned: "0 USD", tone: "leaf" },
    ],
    flows: [
      { from: "B", to: "A", kind: "direct", label: "Direct 5%", amount: "5 USD" },
      { from: "B", to: "A", kind: "level", label: "L1 · 20%", amount: "2 USD" },
      { from: "C", to: "B", kind: "direct", label: "Direct 5%", amount: "5 USD" },
      { from: "C", to: "B", kind: "level", label: "L1 · 20%", amount: "2 USD" },
      { from: "C", to: "A", kind: "level", label: "L2 · 10%", amount: "1 USD" },
    ],
    summary: [
      { k: "Member A", v: "5 USD direct + 2 USD (L1) + 1 USD (L2) = 8 USD" },
      { k: "Member B", v: "5 USD direct + 2 USD (L1) = 7 USD" },
      { k: "Member C", v: "New join — 5 USD paid to Member B on investment" },
    ],
    note: "Values are calculated on the assumptions listed above and change with actual team size and trade income.",
  },
};

export const gettingStarted = {
  eyebrow: "Joining",
  title: "From signup to first payout.",
  steps: [
    {
      index: "01",
      title: "Register",
      detail:
        "Create your member account through the official channel and complete identity verification.",
    },
    {
      index: "02",
      title: "Invest",
      detail:
        "Fund your account with the 100 USD minimum. Your member ID and referral link become active.",
    },
    {
      index: "03",
      title: "Trade & Earn",
      detail:
        "Follow the scheduled trading signals. Monthly ROI and team income post to your dashboard.",
    },
    {
      index: "04",
      title: "Withdraw",
      detail:
        "Request a withdrawal from 10 USD. From 5% processing fee is applied automatically.",
    },
  ],
};

export const missionVision = {
  mission: {
    title: "Our Mission",
    body: "Our mission is to make structured income accessible to everyone regardless of capital or background. A 100 USD entry point, published percentages, and a compensation plan written in plain language remove the guesswork that usually comes with financial products.",
  },
  vision: {
    title: "Our Vision",
    body: "We are building a long-term platform where trading performance and team activity are rewarded through one transparent framework — supported by technology, clear reporting, and governance that members can verify.",
  },
};

export const leadership = [
  {
    name: "Trading Operations",
    role: "Platform Performance",
    focus: "Live Trading",
    experience: "Accountable for monthly trade income",
    bio: "Runs the trading schedule that generates the monthly ROI, and signs off on the performance figure used for every payout.",
  },
  {
    name: "Member Operations",
    role: "Onboarding & Support",
    focus: "Members",
    experience: "Accountable for requests and withdrawals",
    bio: "Handles registration, funding, and withdrawal requests end to end, and reports each request against the published timelines.",
  },
  {
    name: "Compliance & Reporting",
    role: "Terms & Governance",
    focus: "Transparency",
    experience: "Accountable for published terms",
    bio: "Keeps the published rates, fees, and caps accurate, and documents every change before it applies to a member.",
  },
];

export const corporate = {
  entity: "Colorado Corporation",
  entityType: "Registered corporation",
  jurisdiction: "State of Colorado, United States",
  address: [
    "1942 Broadway Street, Suite 314C",
    "Boulder, Colorado 80302",
    "United States of America",
  ],
  statement:
    "BIG operates with a commitment to transparency, innovation, and long-term business development while delivering technology-driven trading solutions for its global member community.",
  principles: [
    {
      k: "Published Terms",
      v: "Every rate, fee, and cap is stated on the public page and applied without exception.",
    },
    {
      k: "Member Reporting",
      v: "Income, level position, and withdrawal history are reported per member, not in aggregate.",
    },
    {
      k: "Documented Withdrawal",
      v: "Withdrawal conditions are fixed, published, and applied identically to every request.",
    },
    {
      k: "Governance Access",
      v: "Registered office details are maintained so members, partners, and regulators can verify the entity.",
    },
  ],
};


export const navLinks = [
  { href: "#package", label: "Package" },
  { href: "#withdrawal", label: "Withdrawal" },
  { href: "#earnings", label: "Earnings" },
  { href: "#levels", label: "Levels" },
  { href: "#corporate", label: "Company" },
] as const;