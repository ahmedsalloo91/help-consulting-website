import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  Code2,
  FileText,
  Gavel,
  Megaphone,
  Scale,
  ShieldCheck,
  Target,
  UsersRound
} from "lucide-react";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" }
];

export const services = [
  {
    title: "Strategy & Business Transformation",
    description:
      "Business diagnosis, operating models, growth planning, governance, and transformation roadmaps.",
    icon: Target
  },
  {
    title: "HR Consulting",
    description:
      "Organization structures, recruitment systems, SOPs, KPIs, salary scales, and people development.",
    icon: UsersRound
  },
  {
    title: "Finance & Economic Advisory",
    description:
      "Costing, financial planning, performance tracking, cash-flow visibility, and decision support.",
    icon: ChartNoAxesCombined
  },
  {
    title: "Marketing & PR",
    description:
      "Brand positioning, campaign planning, customer journeys, PR direction, and market communication.",
    icon: Megaphone
  },
  {
    title: "Legal Support",
    description:
      "Practical legal guidance for business structure, contracts, compliance, banking, and civil matters.",
    icon: Gavel
  },
  {
    title: "Tech Solutions",
    description:
      "ERP, CRM, dashboards, workflow automation, reporting systems, and AI tools for daily operations.",
    icon: Code2
  }
];

export const industries = [
  "Bakeries and food production",
  "Retail and trading businesses",
  "Gaming and electronics stores",
  "FMCG",
  "Family businesses",
  "Service companies",
  "Healthcare and pharma-related businesses"
].map((title, index) => ({
  title,
  description:
    index === 4
      ? "Helping ownership teams move from founder-led effort to structured departments and accountability."
      : "Building clearer systems, roles, reporting, and growth plans for active operators.",
  icon: [Building2, BriefcaseBusiness, Code2, BarChart3, ShieldCheck, FileText, Scale][index]
}));

export const caseStudies = [
  {
    title: "Bakery Transformation",
    description:
      "Costing, waste tracking, inventory control, and branch performance systems for a growing food business.",
    tags: ["Costing", "Inventory", "Performance"]
  },
  {
    title: "Retail & Gaming Transformation",
    description:
      "A family business moved toward a corporate structure with clearer roles, reporting, and growth planning.",
    tags: ["Structure", "Retail", "Governance"]
  },
  {
    title: "HR Restructuring",
    description:
      "Defined roles, salary scale, SOPs, KPIs, and practical HR systems to support daily management.",
    tags: ["HR", "SOPs", "KPIs"]
  },
  {
    title: "Marketing Transformation",
    description:
      "Brand positioning and campaign planning that aligned commercial goals with customer-facing messaging.",
    tags: ["Brand", "Campaigns", "Planning"]
  }
];

export const team = [
  {
    name: "Ahmed Hussein",
    role: "Strategy & Business Consultant",
    bio: "Strategy, marketing, sales, management, and finance-oriented consulting for growing companies."
  },
  {
    name: "Omar Ali",
    role: "Technology & Marketing Consultant",
    bio: "Marketing, technology, programming, design, dashboards, automation, and AI tools."
  },
  {
    name: "Amna Emad",
    role: "HR Consultant",
    bio: "HR, recruitment, SOPs, HR systems, people development, and organizational structure."
  },
  {
    name: "Dalia Srour",
    role: "Legal Consultant",
    bio: "Legal consulting with banking and civil law experience for business and operational needs."
  }
];

export const workSteps = [
  {
    title: "Diagnose",
    description: "Understand the business, people, numbers, market position, and operational pressure points."
  },
  {
    title: "Plan",
    description: "Design a practical roadmap with priorities, owners, timelines, and expected outcomes."
  },
  {
    title: "Implement",
    description: "Build the systems, documents, workflows, dashboards, and management habits with the team."
  },
  {
    title: "Measure",
    description: "Track performance, improve adoption, and turn decisions into repeatable management routines."
  }
];
