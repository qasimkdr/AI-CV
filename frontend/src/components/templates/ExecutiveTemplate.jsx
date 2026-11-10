import { SECTION_TITLES, contactItems, normalizeResume } from "./resumeData";
import { Page, Photo, SectionBody } from "./shared";

const SERIF = 'Georgia, "Times New Roman", serif';
const GOLD = "#b08a3e";
const NAVY = "#1f2a44";

const TITLES = { ...SECTION_TITLES, summary: "Executive Profile", skills: "Core Competencies", experience: "Professional Experience", projects: "Key Initiatives" };
const HALF = new Set(["education", "certifications", "languages", "courses", "memberships", "interests", "references", "awards"]);

function Heading({ children }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.25em]" style={{ color: NAVY }}>{children}</h2>
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
    </div>
  );
}

const theme = {
  accent: GOLD,
  inline: true,
  inlineSep: " — ",
  inlineSepClass: "font-normal text-slate-500",
  orgInlineClass: "font-normal italic text-slate-600",
  titleClass: "text-[15px] font-bold",
  smallTitleClass: "font-bold",
  dateClass: "text-[11px] font-semibold uppercase tracking-wider text-slate-500",
  bulletClass: "!rounded-none rotate-45",
  skills: "grid",
  chipClass: "rounded px-2 py-0.5 ring-1 ring-amber-200 text-[12px]",
  summaryClass: "text-[13.5px] leading-relaxed",
  summaryStyle: { fontFamily: SERIF },
};
const half = { ...theme, compact: true, inline: false, titleClass: "font-bold text-slate-900", orgClass: "text-[12.5px]", dateClass: "text-[11px] text-slate-500" };

export default function ExecutiveTemplate({ data }) {
  const r = normalizeResume(data);
  const contacts = contactItems(r.personal);
  const headline = r.personal.title || r.experience[0]?.title;
  const fullIds = r.order.filter((id) => !HALF.has(id));
  const halfIds = r.order.filter((id) => HALF.has(id));

  return (
    <Page className="px-14 py-12 text-slate-700" style={{ "--navy": NAVY }}>
      <header className="text-center">
        <Photo src={r.personal.photo} className="mx-auto mb-4 h-24 w-24 rounded-full" style={{ boxShadow: `0 0 0 3px #fff, 0 0 0 4px ${GOLD}` }} />
        <h1 className="text-[36px] tracking-wide" style={{ fontFamily: SERIF, color: NAVY }}>{r.personal.fullName || "Your Name"}</h1>
        {headline && <p className="mt-1 text-[12px] font-semibold uppercase tracking-[0.3em]" style={{ color: GOLD }}>{headline}</p>}
        <div className="mx-auto mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: GOLD }} />
          <span className="h-1.5 w-1.5 rotate-45" style={{ background: GOLD }} />
          <span className="h-px w-16" style={{ background: GOLD }} />
        </div>
        {contacts.length > 0 && (
          <p className="mt-3 text-[12px] text-slate-600">
            {contacts.map((c, i) => (
              <span key={c.key}>
                {i > 0 && <span className="mx-2.5" style={{ color: GOLD }}>•</span>}
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
              </span>
            ))}
          </p>
        )}
        {r.personal.details.length > 0 && <p className="mt-1 text-[11.5px] text-slate-500">{r.personal.details.map((d) => `${d.label}: ${d.value}`).join("   •   ")}</p>}
      </header>

      <div className="[&_p.font-bold]:text-[var(--navy)] [&_p.font-bold]:[font-family:Georgia,serif]">
        {fullIds.map((id) => (
          <section key={id} className="mt-7">
            <Heading>{TITLES[id]}</Heading>
            <SectionBody id={id} r={r} theme={theme} />
          </section>
        ))}

        {halfIds.length > 0 && (
          <div className="mt-7 grid grid-cols-2 gap-x-10 gap-y-7">
            {halfIds.map((id) => (
              <section key={id}>
                <Heading>{TITLES[id]}</Heading>
                <SectionBody id={id} r={r} theme={half} />
              </section>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
