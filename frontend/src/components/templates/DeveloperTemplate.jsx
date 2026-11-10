import { SECTION_TITLES, contactItems, normalizeResume } from "./resumeData";
import { ContactIcon, DetailsList, Page, Photo, SectionBody } from "./shared";

const MONO = 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace';
const TEAL = "#0f9488";
const TITLES = { ...SECTION_TITLES, summary: "about", skills: "stack" };
const HALF = new Set(["education", "certifications", "languages", "courses", "memberships", "interests", "references", "awards"]);

function Heading({ children }) {
  return (
    <h2 className="mb-3 text-[13px] font-bold lowercase text-slate-900" style={{ fontFamily: MONO }}>
      <span style={{ color: TEAL }}>## </span>
      {children}
    </h2>
  );
}

const theme = {
  accent: TEAL,
  titleClass: "text-[14px] font-bold text-slate-900",
  smallTitleClass: "font-bold text-slate-900",
  inline: true,
  inlineSep: " @ ",
  inlineSepClass: "font-medium text-slate-400",
  orgInlineClass: "font-medium text-slate-500",
  dateClass: "text-[11px] text-slate-500 [font-family:ui-monospace,monospace]",
  skills: "chips",
  chipFont: MONO,
  chipClass: "rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11.5px] text-teal-900",
  projectsGrid: true,
  projectCardClass: "rounded-xl border border-slate-200 p-4",
  projectPrefix: <span style={{ color: TEAL, fontFamily: MONO }}>~/</span>,
};
const half = { ...theme, compact: true, inline: false, orgClass: "text-[12.5px]", dateClass: "text-[11px] text-slate-500" };

export default function DeveloperTemplate({ data }) {
  const r = normalizeResume(data);
  const headline = r.personal.title || r.experience[0]?.title;
  const fullIds = r.order.filter((id) => !HALF.has(id));
  const halfIds = r.order.filter((id) => HALF.has(id));

  return (
    <Page className="px-12 py-11 text-slate-700">
      <header className="flex items-start gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <p className="text-[12px] text-slate-400" style={{ fontFamily: MONO }}>
            <span style={{ color: TEAL }}>const</span> profile = {"{"}
          </p>
          <h1 className="mt-1 text-[32px] font-extrabold leading-tight tracking-tight text-slate-900">{r.personal.fullName || "Your Name"}</h1>
          {headline && <p className="text-[14px] font-semibold" style={{ fontFamily: MONO, color: TEAL }}>{headline}</p>}
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-slate-600" style={{ fontFamily: MONO }}>
            {contactItems(r.personal).map((c) => (
              <li key={c.key} className="flex items-center gap-1.5">
                <ContactIcon type={c.icon} className="text-slate-400" />
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
              </li>
            ))}
          </ul>
          <DetailsList details={r.personal.details} className="mt-2 flex flex-wrap gap-x-5 space-y-0 [font-family:ui-monospace,monospace]" />
          <p className="mt-2 text-[12px] text-slate-400" style={{ fontFamily: MONO }}>{"};"}</p>
        </div>
        <Photo src={r.personal.photo} className="h-24 w-24 rounded-xl ring-1 ring-slate-200" />
      </header>

      {fullIds.map((id) => (
        <section key={id} className="mt-7">
          <Heading>{TITLES[id]}</Heading>
          <SectionBody id={id} r={r} theme={theme} />
        </section>
      ))}

      {halfIds.length > 0 && (
        <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-7">
          {halfIds.map((id) => (
            <section key={id}>
              <Heading>{TITLES[id]}</Heading>
              <SectionBody id={id} r={r} theme={half} />
            </section>
          ))}
        </div>
      )}
    </Page>
  );
}
