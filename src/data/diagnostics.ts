export type Diagnostic = {
  id: "risk-velocity" | "sensing" | "antifragile";
  num: "01" | "02" | "03";
  title: string;
  time: string;
  bestFor: string;
  question: string;
  paragraphs: string[];
  domains: string[];
  downloadHref: string;
};

export const diagnostics: Diagnostic[] = [
  {
    id: "risk-velocity",
    num: "01",
    title: "Operational Risk Velocity",
    time: "Roughly fifteen minutes",
    bestFor:
      "Operators looking to understand the risks their business faces. An excellent starting point for those beginning to think about operational excellence.",
    question:
      "Which of the risks in your business are moving <em>fast</em>, which are moving <em>slowly</em>, and which kind is on your radar?",
    paragraphs: [
      "Operational risk shows up in two speeds. Fast risks announce themselves — a key employee resigns, a vendor goes down, a breach happens. Slow risks accumulate quietly — margin compresses by half a point a quarter, vendor lock-in deepens, technical debt grows.",
      "Human attention is calibrated to fast change, which leads most organizations to track fast risks closely and slow risks loosely, often without realizing it. This diagnostic walks through five domains, asking what's moving fast and what's moving slowly in each — surfacing the pattern of where you're attending well and where you're not.",
    ],
    domains: [
      "People & knowledge",
      "Vendors",
      "Technology",
      "Regulatory",
      "Financial",
    ],
    downloadHref: "/diagnostics/risk-velocity.pdf",
  },
  {
    id: "sensing",
    num: "02",
    title: "Sensing & Feedback Loops",
    time: "Roughly fifteen minutes",
    bestFor:
      "Operators who suspect their business has information it isn't using, or who want to think about how their organization actually learns.",
    question:
      "How does your business <em>notice</em> when something has changed — and what happens with what it notices?",
    paragraphs: [
      "Business problems are rarely invisible. The challenge most businesses face is moving from recognizing the problem to getting the right people to act on it. A bookkeeper sees margin compressing. A long-tenured employee notices a vendor's quality slipping. A salesperson hears the same objection three times in a quarter. The signal exists — but is it reaching decision-makers?",
      "This diagnostic looks at the feedback loops your business depends on across five domains. It helps you examine how signals are being generated and what happens once they're received. Most businesses learn well in some areas and poorly in others; the asymmetry is usually the most useful thing the diagnostic surfaces.",
    ],
    domains: [
      "Customers & market",
      "Financials & operations",
      "Employees",
      "Vendors",
      "Operating environment",
    ],
    downloadHref: "/diagnostics/sensing.pdf",
  },
  {
    id: "antifragile",
    num: "03",
    title: "Antifragile",
    time: "Roughly fifteen minutes",
    bestFor:
      "Operators interested in a structural look at where their business sits relative to uncertainty.",
    question:
      "Where does your business <em>get stronger</em> from stress, where does it just survive stress, and where does stress actually do damage?",
    paragraphs: [
      "Most business advice stops at resilience — the ability to absorb a shock and return to baseline. Resilience is real and valuable, but it's also not the highest bar. Some businesses, by design or by accident, use stress as a catalyst for improvement. Nassim Taleb, who coined the term, calls this \"antifragility.\"",
      "Two businesses lose a major client. One struggles to regain its footing; the other ends the year stronger than before. Same shock, different trajectory. This diagnostic walks through five domains and helps you place each on the spectrum from fragile to antifragile — surfacing where exposure has quietly accumulated, and where you may already have built more strength than you realize.",
    ],
    domains: [
      "Revenue",
      "Key dependencies",
      "Operations",
      "Financial position",
      "People",
    ],
    downloadHref: "/diagnostics/antifragile.pdf",
  },
];
