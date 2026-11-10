import { SKILL_GROUP_LABELS, linkHref, linkLabel, toBullets } from "./resumeData";

// Shared building blocks for resume templates.

export function Description({ text, className = "", bulletClass = "" }) {
  const items = toBullets(text);
  if (!items.length) return null;
  if (items.length === 1) return <p className={className}>{items[0]}</p>;
  return (
    <ul className={`space-y-1 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden="true" className={`mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-current opacity-60 ${bulletClass}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

const ICON_PATHS = {
  email: "M4 6h16v12H4z M4 7l8 6 8-6",
  phone: "M6.6 3h3l1.5 4-2 1.3a12 12 0 0 0 6.6 6.6l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.2 2 2 0 0 1 6.6 3z",
  address: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z M12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  linkedin: "M4 4h16v16H4z M8 10v6 M8 7.5v.01 M12 16v-3.5a2 2 0 0 1 4 0V16 M12 10v6",
  github: "M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6.2 0C6.6 2.8 5.6 3.1 5.6 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.2 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
};

export function ContactIcon({ type, className = "", style }) {
  return (
    <svg style={style} viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={ICON_PATHS[type] || ICON_PATHS.link} />
    </svg>
  );
}

/** Base document wrapper: fixed A4-ish width, print-safe colours, no shadows. */
export function Page({ className = "", style, children }) {
  return (
    <article
      className={`resume-page mx-auto w-full max-w-[820px] bg-white text-[13px] leading-relaxed antialiased ${className}`}
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", ...style }}
    >
      {children}
    </article>
  );
}

export function Photo({ src, className = "", style }) {
  if (!src) return null;
  return <img src={src} alt="" className={`shrink-0 object-cover ${className}`} style={style} />;
}

const LEVEL_DOTS = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4, Basic: 1, Native: 4, Fluent: 4 };

function Dots({ level, color }) {
  const n = LEVEL_DOTS[level];
  if (!n) return null;
  return (
    <span className="ml-auto flex shrink-0 gap-0.5 pl-2" aria-label={level}>
      {[1, 2, 3, 4].map((i) => (
        <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i <= n ? color : "#e2e8f0" }} />
      ))}
    </span>
  );
}

/*
 * Generic section renderer. Each template supplies a theme:
 *  Heading, accent, compact (sidebar), skills ('chips'|'comma'|'grid'|'tags'|'list'),
 *  chipClass/chipStyle, titleClass, orgClass/orgStyle, dateClass, inline (title, org on one line).
 */
function Entry({ item, theme, children }) {
  const t = theme;
  const meta = [item.location, item.type].filter(Boolean).join(" · ");

  if (t.inline) {
    return (
      <div className="break-inside-avoid">
        <div className="flex items-baseline justify-between gap-4">
          <p className={t.titleClass}>
            {item.title}
            {item.title && item.org && <span className={t.inlineSepClass ?? "font-normal"}>{t.inlineSep ?? ", "}</span>}
            {item.org && <span className={t.orgInlineClass ?? "font-normal"} style={t.orgStyle}>{item.org}</span>}
          </p>
          {item.date && <span className={`shrink-0 ${t.dateClass}`}>{item.date}</span>}
        </div>
        {meta && <p className={t.metaClass ?? "text-[11.5px] text-slate-500"}>{meta}</p>}
        {children}
      </div>
    );
  }

  return (
    <div className="break-inside-avoid">
      {t.compact ? (
        <>
          <p className={t.titleClass}>{item.title || item.org}</p>
          {item.title && item.org && <p className={t.orgClass} style={t.orgStyle}>{item.org}</p>}
          {item.date && <p className={t.dateClass}>{item.date}</p>}
        </>
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-4">
            <p className={t.titleClass}>{item.title || item.org}</p>
            {item.date && <span className={`shrink-0 ${t.dateClass}`}>{item.date}</span>}
          </div>
          {item.title && item.org && (
            <p className={t.orgClass} style={t.orgStyle}>
              {item.org}
              {meta && <span className="font-normal text-slate-500"> · {meta}</span>}
            </p>
          )}
        </>
      )}
      {children}
    </div>
  );
}

function SkillsBlock({ skills, theme }) {
  const style = theme.skills || "chips";
  const groups = Object.entries(
    skills.reduce((acc, s) => {
      (acc[s.category] ||= []).push(s);
      return acc;
    }, {})
  );
  const grouped = groups.length > 1;

  const render = (list) => {
    if (style === "comma") return <p>{list.map((s) => s.name).join(", ")}</p>;
    if (style === "grid")
      return (
        <ul className={`grid gap-x-6 gap-y-1.5 ${theme.compact ? "grid-cols-1" : "grid-cols-3"}`}>
          {list.map((s, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="h-1 w-1 rotate-45" style={{ background: theme.accent }} />
              {s.name}
              <Dots level={s.level} color={theme.accent} />
            </li>
          ))}
        </ul>
      );
    if (style === "list")
      return (
        <ul className="space-y-1.5">
          {list.map((s, i) => (
            <li key={i} className="flex items-center">
              {s.name}
              <Dots level={s.level} color={theme.accent} />
            </li>
          ))}
        </ul>
      );
    return (
      <div className="flex flex-wrap gap-1.5" style={theme.chipFont ? { fontFamily: theme.chipFont } : undefined}>
        {list.map((s, i) => (
          <span key={i} className={theme.chipClass} style={theme.chipStyle}>
            {s.name}
          </span>
        ))}
      </div>
    );
  };

  if (!grouped) return render(skills);
  return (
    <div className="space-y-2.5">
      {groups.map(([cat, list]) => (
        <div key={cat}>
          <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">{SKILL_GROUP_LABELS[cat] || cat}</p>
          {render(list)}
        </div>
      ))}
    </div>
  );
}

export function SectionBody({ id, r, theme }) {
  const t = theme;
  const list = (items, withDesc = true) => (
    <div className={t.compact ? "space-y-3" : "space-y-4"}>
      {items.map((item, i) => (
        <Entry key={i} item={item} theme={t}>
          {withDesc && item.description && <Description text={item.description} className={`mt-1 ${t.bodyClass || ""}`} bulletClass={t.bulletClass} />}
        </Entry>
      ))}
    </div>
  );

  switch (id) {
    case "summary":
      return <p className={t.summaryClass} style={t.summaryStyle}>{r.summary}</p>;
    case "experience":
    case "volunteering":
    case "awards":
      return list(r[id]);
    case "education":
      return (
        <div className={t.compact ? "space-y-3" : "space-y-4"}>
          {r.education.map((e, i) => (
            <Entry key={i} item={e} theme={t}>
              {(e.grade || e.honors) && <p className="text-[12px] text-slate-600">{[e.grade, e.honors].filter(Boolean).join(" · ")}</p>}
              {e.description && <p className={`mt-0.5 text-[12px] ${t.bodyClass || ""}`}>{e.description}</p>}
            </Entry>
          ))}
        </div>
      );
    case "certifications":
    case "courses":
    case "memberships":
      return (
        <div className={t.compact ? "space-y-2.5" : "space-y-2.5"}>
          {r[id].map((c, i) => (
            <Entry key={i} item={c} theme={{ ...t, titleClass: t.smallTitleClass || t.titleClass }}>
              {c.meta && <p className="text-[11px] text-slate-500">{c.meta}</p>}
            </Entry>
          ))}
        </div>
      );
    case "projects":
      return (
        <div className={t.projectsGrid && !t.compact ? "grid grid-cols-2 gap-3" : "space-y-4"}>
          {r.projects.map((p, i) => (
            <div key={i} className={`break-inside-avoid ${t.projectCardClass || ""}`}>
              <p className={t.titleClass}>
                {t.projectPrefix}
                {p.title}
                {p.role && <span className="font-normal text-slate-500"> · {p.role}</span>}
              </p>
              {p.link && (
                <a href={linkHref(p.link)} className="text-[11.5px] underline-offset-2 hover:underline" style={{ color: t.accent }}>
                  {linkLabel(p.link)}
                </a>
              )}
              <Description text={p.description} className={`mt-1 ${t.bodyClass || ""}`} bulletClass={t.bulletClass} />
            </div>
          ))}
        </div>
      );
    case "publications":
      return (
        <div className="space-y-2.5">
          {r.publications.map((p, i) => (
            <Entry key={i} item={p} theme={t}>
              {p.link && (
                <a href={linkHref(p.link)} className="text-[11.5px]" style={{ color: t.accent }}>
                  {linkLabel(p.link)}
                </a>
              )}
            </Entry>
          ))}
        </div>
      );
    case "skills":
      return <SkillsBlock skills={r.skills} theme={t} />;
    case "languages":
      return t.skills === "comma" ? (
        <p>{r.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join(", ")}</p>
      ) : (
        <ul className={t.compact ? "space-y-1.5" : "grid grid-cols-2 gap-x-6 gap-y-1.5"}>
          {r.languages.map((l, i) => (
            <li key={i} className="flex items-baseline justify-between gap-2">
              <span className="font-medium text-slate-800">{l.name}</span>
              {l.level && <span className="text-[11.5px] text-slate-500">{l.level}</span>}
            </li>
          ))}
        </ul>
      );
    case "interests":
      return t.skills === "comma" ? (
        <p>{r.interests.join(", ")}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {r.interests.map((x, i) => (
            <span key={i} className={t.chipClass} style={t.chipStyle}>
              {x}
            </span>
          ))}
        </div>
      );
    case "references":
      if (r.references.mode === "request" || !r.references.items.length) return <p className="italic text-slate-600">Available upon request.</p>;
      return (
        <div className={t.compact ? "space-y-2.5" : "grid grid-cols-2 gap-4"}>
          {r.references.items.map((x, i) => (
            <div key={i} className="break-inside-avoid">
              <p className={t.smallTitleClass || t.titleClass}>{x.name}</p>
              {x.title && <p className="text-[12px] text-slate-600">{x.title}</p>}
              {x.contact && <p className="text-[11.5px] text-slate-500">{x.contact}</p>}
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}

/** Personal details block (DOB, nationality…) — rendered by templates where they like. */
export function DetailsList({ details, className = "", labelClass = "text-slate-500" }) {
  if (!details?.length) return null;
  return (
    <dl className={`space-y-1 text-[12px] ${className}`}>
      {details.map((d) => (
        <div key={d.label} className="flex flex-wrap gap-x-1.5">
          <dt className={labelClass}>{d.label}:</dt>
          <dd>{d.value}</dd>
        </div>
      ))}
    </dl>
  );
}
