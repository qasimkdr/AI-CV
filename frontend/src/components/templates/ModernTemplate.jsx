import { SECTION_TITLES, contactItems, normalizeResume } from "./resumeData";
import { ContactIcon, DetailsList, Page, Photo, SectionBody } from "./shared";

const ACCENT = "#5b4bff";
const SIDE = new Set(["skills", "languages", "certifications", "courses", "interests", "memberships", "references", "awards"]);

function Heading({ children }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
      <span className="h-[2px] w-4 rounded-full" style={{ background: ACCENT }} />
      {children}
    </h2>
  );
}

const main = {
  accent: ACCENT,
  titleClass: "text-[14px] font-bold text-slate-900",
  smallTitleClass: "font-bold text-slate-900",
  orgClass: "text-[12.5px] font-semibold",
  orgStyle: { color: ACCENT },
  dateClass: "text-[11px] font-medium text-slate-500",
  skills: "chips",
  chipClass: "rounded-md px-2 py-1 text-[11.5px] font-medium text-slate-700",
  chipStyle: { background: "#f1efff" },
};
const side = { ...main, compact: true, titleClass: "font-bold leading-snug text-slate-900", orgClass: "text-[12.5px]", orgStyle: undefined, dateClass: "text-[11px] text-slate-500" };

export default function ModernTemplate({ data }) {
  const r = normalizeResume(data);
  const headline = r.personal.title || r.experience[0]?.title;
  const sideIds = r.order.filter((id) => SIDE.has(id) || id === "education");
  const mainIds = r.order.filter((id) => !sideIds.includes(id));

  return (
    <Page className="text-slate-700">
      <header className="relative flex items-center gap-6 overflow-hidden px-12 pb-8 pt-11" style={{ background: "linear-gradient(135deg,#f4f2ff 0%,#eef6ff 100%)" }}>
        <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: ACCENT }} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[34px] font-extrabold leading-tight tracking-tight text-slate-900">{r.personal.fullName || "Your Name"}</h1>
          {headline && <p className="mt-1 text-[15px] font-semibold" style={{ color: ACCENT }}>{headline}</p>}
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-slate-600">
            {contactItems(r.personal).map((c) => (
              <li key={c.key} className="flex items-center gap-1.5">
                <ContactIcon type={c.icon} className="text-slate-400" />
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
              </li>
            ))}
          </ul>
        </div>
        <Photo src={r.personal.photo} className="h-28 w-28 rounded-2xl ring-4 ring-white" />
      </header>

      <div className="grid grid-cols-[1fr_230px] gap-10 px-12 py-9">
        <main className="space-y-7">
          {mainIds.map((id) => (
            <section key={id}>
              <Heading>{SECTION_TITLES[id]}</Heading>
              <SectionBody id={id} r={r} theme={main} />
            </section>
          ))}
        </main>
        <aside className="space-y-7">
          {r.personal.details.length > 0 && (
            <section>
              <Heading>Personal details</Heading>
              <DetailsList details={r.personal.details} />
            </section>
          )}
          {sideIds.map((id) => (
            <section key={id}>
              <Heading>{SECTION_TITLES[id]}</Heading>
              <SectionBody id={id} r={r} theme={side} />
            </section>
          ))}
        </aside>
      </div>
    </Page>
  );
}
