import { Link } from "react-router-dom";
const Github = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

import Logo from "../brand/Logo";

const cols = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/#features" },
      { label: "Resume templates", to: "/templates" },
      { label: "How it works", to: "/#how-it-works" },
      { label: "FAQ", to: "/#faq" },
    ],
  },
  {
    title: "Templates",
    links: [
      { label: "Modern resume", to: "/templates#modern" },
      { label: "ATS classic resume", to: "/templates#ats" },
      { label: "Creative resume", to: "/templates#creative" },
      { label: "Developer resume", to: "/templates#developer" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Create free account", to: "/signup" },
      { label: "Log in", to: "/login" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="no-print relative px-4 pb-8 pt-10 sm:px-6">
      <div className="glass mx-auto max-w-6xl rounded-[2rem] p-8 md:p-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              The AI resume builder that helps you write sharper, look better
              and land more interviews.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { icon: Github, label: "GitHub", href: "https://github.com/qasimkdr/AI-CV" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/80 text-ink-soft shadow-sm transition hover:-translate-y-0.5 hover:text-violet"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="text-sm font-semibold text-ink">{c.title}</p>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-ink-soft transition hover:text-violet"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-violet/10 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} AI CV. Crafted with care.</p>
          <p>Free AI resume builder · ATS-friendly templates · PDF & DOCX export</p>
        </div>
      </div>
    </footer>
  );
}
