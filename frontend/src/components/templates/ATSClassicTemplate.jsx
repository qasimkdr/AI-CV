import { SECTION_TITLES, contactItems, normalizeResume } from "./resumeData";
import { Page, SectionBody } from "./shared";

// Deliberately plain: single column, standard headings, no icons, photo or
// columns — the format applicant tracking systems parse most reliably.
const theme = {
  accent: "#1e293b",
  inline: true,
  titleClass: "font-bold text-slate-900",
  smallTitleClass: "font-bold text-slate-900",
  dateClass: "text-[12px]",
  metaClass: "text-[12px] text-slate-600",
  skills: "comma",
  chipClass: "",
  summaryClass: "",
};

const TITLES = { ...SECTION_TITLES, summary: "Professional Summary" };

export default function ATSClassicTemplate({ data }) {
  const r = normalizeResume(data);
  const contacts = contactItems(r.personal);

  return (
    <Page className="px-14 py-12 text-slate-800" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="text-center">
        <h1 className="text-[28px] font-bold tracking-wide text-slate-900">{r.personal.fullName || "Your Name"}</h1>
        {r.personal.title && <p className="mt-0.5 text-[14px] text-slate-700">{r.personal.title}</p>}
        {contacts.length > 0 && (
          <p className="mt-2 text-[12px] text-slate-700">
            {contacts.map((c, i) => (
              <span key={c.key}>
                {i > 0 && <span className="mx-2 text-slate-400">|</span>}
                {c.href ? <a href={c.href}>{c.label}</a> : c.label}
              </span>
            ))}
          </p>
        )}
        {r.personal.details.length > 0 && (
          <p className="mt-1 text-[11.5px] text-slate-600">{r.personal.details.map((d) => `${d.label}: ${d.value}`).join("  |  ")}</p>
        )}
      </header>

      {r.order.map((id) => (
        <section key={id} className="mt-5">
          <h2 className="border-b border-slate-800 pb-1 text-[12px] font-bold uppercase tracking-[0.12em] text-slate-900">{TITLES[id]}</h2>
          <div className="mt-2.5">
            <SectionBody id={id} r={r} theme={theme} />
          </div>
        </section>
      ))}
    </Page>
  );
}
