export const brand = {
  name: "BIG",
  legalName: "BeInGroup Global Ltd.",
  tagline: "Trading-Powered Investment & Partner Network",
  motto: "Participate in trading. Build a network. Grow together.",
  visionLine: "Everybody benefits from trading.",
};

export const hero = {
  headlineLine1: "“Something BIG is about to happen”",
  headlineLine2: "BIG will make everyone able to earn from trading, even if you don’t have knowledge of trading.",
  body: "No Trading Experience? Start Here.",
  primaryCta: "How You Earn",
  secondaryCta: "Investment Terms",
  stats: [
    { value: "100", unit: "USD", label: "Minimum Investment" },
    { value: "10–12", unit: "%", label: "ROI" },
    { value: "5", unit: "%", label: "Direct Commission" },
    { value: "20", unit: "Levels", label: "Network Reward Depth" },
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
};

export const tradingView = {
  eyebrow: "Trading View",
  title: "The market behind every return.",
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

export const gettingStarted = {
  eyebrow: "Joining",
  title: "From signup to first payout.",
  intro:
    "No Trading Experience? Start Here. Four steps stand between a new account and a first withdrawal. The same path applies to every member, in the same order.",
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
  { href: "#package", label: "Package" },
  { href: "#trading", label: "Trading" },
  { href: "#earnings", label: "Earnings" },
  { href: "#withdrawal", label: "Withdrawal" },
] as const;

export const footerLinks = [
  { href: "#package", label: "Package" },
  { href: "#trading", label: "Trading View" },
  { href: "#earnings", label: "Earnings" },
  { href: "#withdrawal", label: "Withdrawal" },
  { href: "#risk", label: "Forex Risk" },
  { href: "#mission", label: "Mission" },
] as const;
