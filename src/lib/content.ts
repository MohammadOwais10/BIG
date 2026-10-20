export const brand = {
  name: "BIG",
  legalName: "BeInGroup Global Ltd.",
  tagline: "Trading-Powered Investment & Partner Network",
  motto: "Participate in trading. Build a network. Grow together.",
  visionLine: "Everybody benefits from trading.",
};

export const hero = {
  headlineLine1: "Invest 100 USD.",
  headlineLine2: "Earn from trading.",
  body: "BeInGroup is a trading-focused financial platform built on structured Forex trading and a community-based partner network. Every number of the plan is published on this page.",
  primaryCta: "How You Earn",
  secondaryCta: "Investment Terms",
  stats: [
    { value: "100", unit: "USD", label: "Minimum Investment" },
    { value: "10–12", unit: "%", label: "ROI" },
    { value: "5", unit: "%", label: "Direct Commission" },
    { value: "20", unit: "Levels", label: "Network Reward Depth" },
  ],
};

export const businessModel = {
  eyebrow: "Business Model",
  title: "One platform. Two roles.",
  intro:
    "Our business model is designed to bring together participants who provide capital to the platform and partners who help expand our community through referrals.",
  panels: [
    {
      index: "01",
      eyebrow: "Our Trading Model",
      title: "Capital deployed in the company's trading operations",
      body:
        "Funds received through eligible participation in our programs are utilized as part of the company's trading operations, including Forex market activities.",
      points: [
        "Our trading team and technology infrastructure are responsible for managing the trading activities.",
        "Activities are conducted according to the company's defined strategies, risk-management procedures, and operational policies.",
        "A published set of strategy families is used, from discretionary approaches to AI-assisted execution — listed under Trading View below.",
      ],
    },
    {
      index: "02",
      eyebrow: "Our Partner Network",
      title: "Partners expand the community through referrals",
      body:
        "Participants may also have the opportunity to become partners and introduce new participants to the platform.",
      points: [
        "Our compensation plan provides defined rewards for qualifying promotional and network activity.",
        "Commissions are subject to the applicable qualification criteria and terms.",
      ],
    },
  ],
};

export const packageTerms = {
  eyebrow: "Investment Package",
  title: "One package. A published plan.",
  intro:
    "The BeInGroup investment plan, stated in plain numbers. Every figure below is part of the published terms of the plan.",
  terms: [
    {
      label: "ROI",
      value: "10% – 12%",
      note: "The promoter receives the stated ROI, generated from platform trading performance.",
    },
    {
      label: "Direct Referral Commission",
      value: "5 Percent (%)",
      note: "Defined rewards for qualifying promotional and network activity. Commissions are subject to the applicable qualification criteria and terms.",
    },
    {
      label: "Minimum Investment",
      value: "100 USD",
      note: "The entry point for any new participant.",
    },
    {
      label: "Minimum Withdrawal",
      value: "15 USD",
      note: "The lowest amount that can be requested in a single withdrawal.",
    },
    {
      label: "Withdrawal Fee",
      value: "5 Percent (%)",
      note: "A processing fee of 5% is deducted from every withdrawal request.",
    },
    {
      label: "Promoter Capping",
      value: "5 Multiples (x)",
      note: "Total earnings are capped at 5× the initial investment. Top-up to continue.",
    },
  ],
  rewardDepth: {
    label: "Network Reward Depth",
    value: "20 Levels",
    note: "Level rewards are calculated as a percentage of ROI generated across 20 levels of your network, unlocked as you add direct referrals.",
  },
  howItWorks: {
    title: "How a cycle runs",
    steps: [
      {
        title: "Member invests",
        detail: "A new participant activates their account with a minimum investment of 100 USD.",
      },
      {
        title: "Capital is deployed",
        detail: "Funds are allocated to the company's trading operations under the defined strategies and risk-management procedures.",
      },
      {
        title: "Income is credited",
        detail: "ROI is credited to the member, and level rewards are shared across the unlocked network.",
      },
      {
        title: "Member withdraws",
        detail: "Funds can be withdrawn from 15 USD onwards, subject to the published fee and deduction schedule.",
      },
    ],
  },
  caps: [
    {
      title: "Before the cap",
      detail:
        "Promoters earn ROI plus direct and level income from their network, until total earnings reach 5× their initial investment.",
      state: "earning",
    },
    {
      title: "At 5× — the cap",
      detail:
        "Earnings stop accumulating. A top-up is required before earning can continue.",
      state: "capped",
    },
    {
      title: "Top-Up to resume",
      detail:
        "A promoter re-invests to start a fresh earning cycle and continue receiving income from the network.",
      state: "topup",
    },
  ],
  disclaimer:
    "ROI and rewards are not guaranteed and may be subject to market risk, fees, eligibility conditions, and applicable laws. Review the complete terms, withdrawal rules, and the legal/regulatory status of the operator before investing. Do not invest money you cannot afford to lose.",
};

export const tradingView = {
  eyebrow: "Trading View",
  title: "The market behind every return.",
  intro:
    "Every figure published on this page begins on a chart like this one. BeInGroup deploys capital through structured Forex trading, managed by our trading team and technology infrastructure under defined strategies and risk-management procedures.",
  strategies: [
    "Scalping",
    "Hedging",
    "Smart Money",
    "Investing",
    "AI Trading",
  ],
  chart: {
    symbol: "EUR/USD",
    market: "Forex · Spot",
    ma: "MA 12",
    note: "Chart data is simulated for illustration only. Actual returns depend on live trading performance and are never guaranteed.",
  },

};

export const withdrawal = {
  eyebrow: "Withdrawal Rules",
  title: "Published fees and a clear exit schedule.",
  intro:
    "Withdrawals are processed against a fixed and public schedule. There are no discretionary holds once these conditions are met.",
  rules: [
    {
      label: "Minimum Withdrawal",
      value: "15 USD",
      detail: "Any single withdrawal request starts at this amount.",
    },
    {
      label: "Withdrawal Fee",
      value: "5%",
      detail: "Deducted from the requested amount before processing.",
    },
  ],
  deductions: {
    eyebrow: "Capital Deduction Schedule",
    title: "The longer you stay, the lower the deduction.",
    intro:
      "Withdrawals drawn against capital follow a declining deduction, measured from the date of investment. The deduction reduces over time and reaches zero after 150 days.",
    rows: [
      { window: "Before 30 days", deduction: "10%", rate: 10 },
      { window: "Up to 60 days / 1st month", deduction: "8%", rate: 8 },
      { window: "Up to 90 days / 2nd month", deduction: "6%", rate: 6 },
      { window: "Up to 120 days / 3rd month", deduction: "4%", rate: 4 },
      { window: "Up to 150 days / 4th month", deduction: "2%", rate: 2 },
      { window: "After 150 days", deduction: "0%", rate: 0 },
    ],
    note:
      "The deduction applies to the capital portion of a withdrawal. ROI already credited to the member is unaffected.",
  },
  feeNote:
    "The applicable fee and any capital deduction are shown transparently before every withdrawal is confirmed.",
};

export const earnings = {
  eyebrow: "Earning Structure",
  title: "Two ways to earn inside BeInGroup.",
  intro:
    "Income comes from two independent streams. Direct income is generated the moment a referral invests. Level income is earned as a percentage of the ROI generated by members in your network, unlocked level by level as you add direct referrals.",
  streams: [
    {
      id: "direct",
      index: "01",
      name: "Direct Income",
      rate: "5%",
      rateLabel: "of referred investment",
      summary:
        "Refer a new participant, and you earn 5% of their investment amount the moment they join and fund their account.",
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
      rateLabel: "of ROI, unlocked level by level",
      summary:
        "Level rewards are calculated as a percentage of the ROI generated by the members below you.",
      points: [
        "Calculated as a percentage of ROI — not on investment amounts.",
        "Paid across 20 levels, from your closest referral to the deepest.",
        "Combines with direct income — both streams run at the same time.",
      ],
      meta: [
        { k: "Trigger", v: "Downline ROI" },
        { k: "Basis", v: "ROI generated" },
        { k: "Depth", v: "20 levels" },
      ],
    },
  ],
  ladder: {
    eyebrow: "Level Unlocking & ROI Rewards",
    title: "Reward per level, and what unlocks it",
    subtitle:
      "Each reward is a percentage of the ROI generated in your network. Levels 1–5 each require 2 direct referrals to unlock; levels 6–20 each require 1 direct referral.",
    rows: [
      { level: "Promoter / You", rate: 12, label: "Your personal ROI (top of 10%–12%)", requirement: "—" },
      { level: "Level 1", rate: 20, label: "Your direct referral", requirement: "2 direct referrals" },
      { level: "Level 2", rate: 10, label: "Second generation", requirement: "2 direct referrals" },
      { level: "Level 3", rate: 7.5, label: "Third generation", requirement: "2 direct referrals" },
      { level: "Level 4", rate: 5, label: "Fourth generation", requirement: "2 direct referrals" },
      { level: "Level 5", rate: 2.5, label: "Fifth generation", requirement: "2 direct referrals" },
      { level: "Level 6 – 10", rate: 1, label: "Sixth to tenth generation", requirement: "1 direct referral each" },
      { level: "Level 11 – 20", rate: 0.5, label: "Eleventh to twentieth generation", requirement: "1 direct referral each" },
    ],
    footerNote:
      "Level rewards accrue only while the network member remains active and generating ROI.",
  },
};

export const forexRisk = {
  eyebrow: "Understanding the Market",
  title: "Why Forex trading is not everybody's job.",
  intro:
    "Forex provides access to a global financial market, but it involves significant financial risk. Prices can change rapidly and losses can occur. Here is what every participant should understand before allocating capital.",
  risks: [
    {
      index: "01",
      title: "Capital Can Be Lost",
      detail:
        "Forex trading does not guarantee profits. A trading position can lose value, and participants may lose part or all of the capital allocated to trading.",
    },
    {
      index: "02",
      title: "Leverage Increases Risk",
      detail:
        "Leverage allows a trader to control a larger position with a smaller amount of capital. It can magnify gains, but it magnifies losses too — even relatively small market movements can have a substantial effect on an account.",
    },
    {
      index: "03",
      title: "Markets Can Be Highly Volatile",
      detail:
        "Currency prices can move quickly in response to economic data, central-bank decisions, interest-rate changes, geopolitical developments, inflation, employment reports, market sentiment and unexpected global events — sometimes within seconds or minutes.",
    },
    {
      index: "04",
      title: "Successful Trading Requires Knowledge",
      detail:
        "Forex is not simply a matter of predicting whether a currency will rise or fall. Understanding market structure, risk management, position sizing, leverage, execution and trading costs is important.",
    },
    {
      index: "05",
      title: "Emotional Decisions Can Increase Losses",
      detail:
        "Fear, greed, overconfidence and the desire to recover previous losses can influence trading decisions. Without discipline and risk controls, these behaviours can increase financial losses.",
    },
    {
      index: "06",
      title: "Past Performance Does Not Predict Future Results",
      detail:
        "A trading strategy, trader or program may perform well in one period and poorly in another. Previous trading results should not be treated as a guarantee of future performance.",
    },
  ],
};

export const workedExample = {
  eyebrow: "Worked Example",
  title: "How the money actually moves.",
  intro:
    "The example below follows three members from investment through network income. It uses 100 USD investments and 10 USD of ROI per member so every figure is easy to verify.",
  assumptions: [
    { k: "Investment per member", v: "100 USD" },
    { k: "ROI per member", v: "10 USD" },
    { k: "Direct commission", v: "5%" },
  ],
  unlockNote:
    "Level rewards are shown as if each level's direct-referral requirement is already met — Level 1 requires 2 direct referrals, Level 2 requires 2 direct referrals. Under the plan, a level starts paying only once its requirement is met.",
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
      summary: "Level rewards are paid as a percentage of the ROI generated below you.",
      lines: [
        { text: "Member B generates 10 USD of ROI.", tone: "plain" },
        {
          text: "Member A sits at Level 1 to Member B → 20% of 10 USD = 2 USD.",
          tone: "highlight",
        },
        { text: "Member B refers Member C and earns 20% of C's ROI at Level 1.", tone: "plain" },
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
  },
};

export const gettingStarted = {
  eyebrow: "Joining",
  title: "From signup to first payout.",
  intro:
    "Four steps stand between a new account and a first withdrawal. The same path applies to every member, in the same order.",
  steps: [
    {
      title: "Register",
      detail:
        "Create your member account through the official channel and complete identity verification.",
    },
    {
      title: "Invest",
      detail:
        "Fund your account with the 100 USD minimum. Your member ID and referral link become active.",
    },
    {
      title: "Participate & Earn",
      detail:
        "Capital is deployed into the trading operation. ROI and network income post to your dashboard.",
    },
    {
      title: "Withdraw",
        detail:
          "Request a withdrawal from 15 USD. The published fee and any capital deduction are applied automatically.",
    },
  ],
};

export const missionVision = {
  mission: {
    title: "Our Mission",
    body: "Trading on any financial market is not everybody's job — most people try, lose and stop. Our vision is to build a technology-driven trading ecosystem where everybody can benefit from trading activity indirectly, and where partners can grow a structured network within a clearly defined business model.",
  },
  vision: {
    title: "Our Vision",
    body: "We aim to develop a platform where anybody can participate for trading benefits, while partners build and manage their referral networks through dedicated digital tools.",
  },
};

export const principles = {
  eyebrow: "Our Approach",
  title: "Four principles behind every decision.",
  items: [
    {
      index: "01",
      title: "Trading",
      detail:
        "We do not depend on any single strategy. Capital is deployed across structured Forex trading using multiple strategy families, managed by our trading team and technology infrastructure.",
    },
    {
      index: "02",
      title: "Technology",
      detail:
        "Digital infrastructure for account, network and commission management.",
    },
    {
      index: "03",
      title: "Transparency",
      detail:
        "Clearly communicating applicable program terms, qualification requirements, fees, risks and rewards.",
    },
    {
      index: "04",
      title: "Community",
      detail:
        "Building a global network through legitimate referrals and partner relationships.",
    },
  ],
};

export const leadership = [
  {
    name: "Trading Operations",
    role: "Platform Performance",
    focus: "Live Trading",
    experience: "Accountable for trade income",
    bio: "Runs the trading schedule that generates the ROI, and signs off on the performance figure used for every payout.",
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
  eyebrow: "Corporate Information",
  title: "Registered, published, and open to verification.",
  intro:
    "Registered office and governance details for members, partners, and regulators.",
  entity: "BeInGroup Global Ltd.",
  entityType: "Registered corporation",
  jurisdiction: "State of Colorado, United States",
  address: [
    "1942 Broadway Street, Suite 314C",
    "Boulder, Colorado 80302",
    "United States of America",
  ],
  statement:
    "BeInGroup operates with a commitment to transparency, innovation, and long-term business development while delivering technology-driven trading solutions for its global member community.",
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
  { href: "#model", label: "Model" },
  { href: "#package", label: "Package" },
  { href: "#trading", label: "Trading" },
  { href: "#withdrawal", label: "Withdrawal" },
  { href: "#earnings", label: "Earnings" },
  { href: "#start", label: "Get Started" },
] as const;

export const footerLinks = [
  { href: "#model", label: "Business Model" },
  { href: "#package", label: "Package" },
  { href: "#trading", label: "Trading View" },
  { href: "#withdrawal", label: "Withdrawal" },
  { href: "#earnings", label: "Earnings" },
  { href: "#levels", label: "Levels" },
  { href: "#example", label: "Worked Example" },
  { href: "#start", label: "Get Started" },
  { href: "#risk", label: "Forex Risk" },
  { href: "#mission", label: "Mission" },
  { href: "#leadership", label: "Leadership" },
  { href: "#corporate", label: "Company" },
] as const;
