// Central SEO configuration. Shared by the runtime <Seo /> component and the
// build-time script (scripts/seo-build.mjs) that writes per-route HTML,
// sitemap.xml and robots.txt — keep it free of browser-only APIs.

export const SITE = {
  name: "AI CV",
  url: (
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_SITE_URL) ||
    "https://aicvfrontend.netlify.app"
  ).replace(/\/$/, ""),
  tagline: "AI Resume Builder",
  description:
    "AI CV is a free AI resume builder. Create ATS-friendly resumes in minutes, rewrite bullet points with AI, pick from modern templates and export to PDF or DOCX.",
  ogImage: "/og-image.png",
  themeColor: "#7c5cff",
  locale: "en_US",
};

// Public, indexable routes. Private routes get noindex at runtime.
export const ROUTES = {
  "/": {
    title: "AI CV — Free AI Resume Builder | ATS-Friendly CV Templates",
    description: SITE.description,
    priority: "1.0",
    changefreq: "weekly",
  },
  "/templates": {
    title: "Free ATS Resume Templates — Modern, Creative & Executive | AI CV",
    description:
      "Browse free ATS-friendly resume templates: Modern, ATS Classic, Creative, Executive and Developer. Customize with AI and download as PDF or DOCX.",
    priority: "0.9",
    changefreq: "monthly",
  },
  "/signup": {
    title: "Create Your Free Account — AI CV Resume Builder",
    description:
      "Sign up for AI CV and build a professional, ATS-optimized resume with AI writing help in minutes. No credit card required.",
    priority: "0.7",
    changefreq: "yearly",
  },
  "/login": {
    title: "Log In — AI CV Resume Builder",
    description:
      "Log in to AI CV to edit your resumes, enhance them with AI and export to PDF or DOCX.",
    priority: "0.5",
    changefreq: "yearly",
  },
};

export const FAQS = [
  {
    q: "Is AI CV free to use?",
    a: "Yes. You can create an account, build resumes with every template, enhance them with AI and export to PDF or DOCX at no cost.",
  },
  {
    q: "Are the resume templates ATS-friendly?",
    a: "Every template uses clean, semantic structure and readable fonts so Applicant Tracking Systems can parse your name, experience, skills and education correctly. The ATS Classic template is the most conservative choice.",
  },
  {
    q: "How does the AI resume enhancement work?",
    a: "With one click, AI rewrites your summary, experience and project descriptions with stronger action verbs, clearer impact and better keywords, while keeping your facts intact. You can review and keep editing afterwards.",
  },
  {
    q: "Can I download my resume as PDF and Word?",
    a: "Yes. Export a print-perfect PDF or an editable DOCX file that opens in Microsoft Word and Google Docs.",
  },
  {
    q: "Can I switch templates after writing my resume?",
    a: "Absolutely. Your content is stored separately from the design, so you can switch between templates at any time without retyping anything.",
  },
];

export const absoluteUrl = (path = "/") =>
  `${SITE.url}${path === "/" ? "/" : path}`;

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: absoluteUrl("/favicon.svg"),
});

export const appJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: SITE.url,
  description: SITE.description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI resume writing",
    "ATS-friendly templates",
    "PDF export",
    "DOCX export",
  ],
});

export const faqJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
});
