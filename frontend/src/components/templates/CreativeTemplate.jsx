import { SECTION_TITLES, contactItems, initials, normalizeResume } from "./resumeData";
import { ContactIcon, DetailsList, Description, Page, Photo, SectionBody } from "./shared";

const ROSE = "#e0457b";
const SIDE = new Set(["skills", "languages", "education", "certifications", "courses", "interests", "memberships", "references"]);

function SideHeading({ children }) {
  return <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-900/70">{children}</h2>;
}

function MainHeading({ children }) {
  return (
    <h2 className="mb-4 text-[18px] font-extrabold tracking-tight text-slate-900">
      {children}
      <span className="ml-1" style={{ color: ROSE }}>.</span>
    </h2>
  );
}

const sideTheme = {
  accent: ROSE,
  compact: true,
  titleClass: "text-[12px] font-bold leading-snug text-slate-900",
  smallTitleClass: "text-[12px] font-semibold text-slate-800",
  orgClass: "text-[12px]",
  dateClass: "text-[11px] text-slate-500",
  skills: "chips",
  chipClass: "rounded-full bg-white px-2.5 py-1 text-[11.5px] font-medium text-slate-700 ring-1 ring-rose-200",
  bodyClass: "text-[12px]",
};

const mainTheme = {
  accent: ROSE,
  titleClass: "text-[14px] font-bold text-slate-900",
  smallTitleClass: "font-bold text-slate-900",
  orgClass: "text-[12.5px] font-medium",
  orgStyle: { color: ROSE },
  dateClass: "text-[11px] font-semibold text-slate-500",
  projectsGrid: true,
  projectCardClass: "rounded-xl bg-rose-50/60 p-4 ring-1 ring-rose-100",
  chipClass: sideTheme.chipClass,
};

function Timeline({ items }) {
  return (
    <ol className="relative space-y-5 border-l-2 border-rose-100 pl-5">
      {items.map((e, i) => (
        <li key={i} className="relative break-inside-avoid">
          <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white" style={{ background: ROSE }} />
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[14px] font-bold text-slate-900">{e.title || e.org}</h3>
            <span className="shrink-0 text-[11px] font-semibold text-slate-500">{e.date}</span>
          </div>
          {e.title && e.org && (
            <p className="text-[12.5px] font-medium" style={{ color: ROSE }}>
              {e.org}
              {(e.location || e.type) && <span className="font-normal text-slate-500"> · {[e.location, e.type].filter(Boolean).join(" · ")}</span>}
            </p>
          )}
          <Description text={e.description} className="mt-1.5" />
        </li>
      ))}
    </ol>
  );
}

export default function CreativeTemplate({ data }) {
  const r = normalizeResume(data);
  const headline = r.personal.title || r.experience[0]?.title;
  const sideIds = r.order.filter((id) => SIDE.has(id));
  const mainIds = r.order.filter((id) => !SIDE.has(id) && id !== "summary");

  return (
    <Page className="grid min-h-[1060px] grid-cols-[250px_1fr] text-slate-700">
      <aside className="space-y-7 px-7 py-10" style={{ background: "linear-gradient(180deg,#fff0f5 0%,#fff6ec 100%)" }}>
        {r.personal.photo ? (
          <Photo src={r.personal.photo} className="h-28 w-28 rounded-[28%] ring-4 ring-white" />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-[28%] text-[26px] font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${ROSE}, #f59e6b)` }}>
            {initials(r.personal.fullName) || "CV"}
          </div>
        )}

        <section>
          <SideHeading>Contact</SideHeading>
          <ul className="space-y-2 text-[12px]">
            {contactItems(r.personal).map((c) => (
              <li key={c.key} className="flex items-start gap-2 break-all">
                <ContactIcon type={c.icon} className="mt-[3px]" style={{ color: ROSE }} />
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
              </li>
            ))}
          </ul>
        </section>

        {r.personal.details.length > 0 && (
          <section>
            <SideHeading>Details</SideHeading>
            <DetailsList details={r.personal.details} />
          </section>
        )}

        {sideIds.map((id) => (
          <section key={id}>
            <SideHeading>{SECTION_TITLES[id]}</SideHeading>
            <SectionBody id={id} r={r} theme={sideTheme} />
          </section>
        ))}
      </aside>

      <main className="px-10 py-10">
        <header className="mb-8">
          <h1 className="text-[38px] font-extrabold leading-[1.05] tracking-tight text-slate-900">{r.personal.fullName || "Your Name"}</h1>
          {headline && (
            <p className="mt-2 inline-block rounded-full px-3 py-1 text-[12.5px] font-semibold text-white" style={{ background: ROSE }}>
              {headline}
            </p>
          )}
          {r.order.includes("summary") && <p className="mt-4 text-[13.5px] leading-relaxed">{r.summary}</p>}
        </header>

        <div className="space-y-8">
          {mainIds.map((id) => (
            <section key={id}>
              <MainHeading>{SECTION_TITLES[id]}</MainHeading>
              {id === "experience" || id === "volunteering" ? <Timeline items={r[id]} /> : <SectionBody id={id} r={r} theme={mainTheme} />}
            </section>
          ))}
        </div>
      </main>
    </Page>
  );
}
