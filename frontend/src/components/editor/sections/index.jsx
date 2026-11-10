import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";

import EntryListForm from "../EntryListForm";
import { ChipInput, TextArea } from "../FormBits";
import { Segmented } from "../inputs";
import { useEditor } from "../EditorContext";
import { EMPLOYMENT_TYPES, LANGUAGE_LEVELS, SKILL_CATEGORIES, SKILL_LEVELS } from "../../../lib/sections";
import { SOFT_SKILLS } from "../../../lib/fields";
import { suggestBullets } from "../../../services/geminiApi";
import { toast } from "../../../lib/toast";

const join = (...parts) => parts.filter(Boolean).join(" · ");
const setKey = (setData, key) => (value) => setData((prev) => ({ ...prev, [key]: value }));

function useAiBullets() {
  const { field } = useEditor();
  const [busy, setBusy] = useState(-1);

  const bulletProps = (item, index, setValue, kind = "job") => ({
    aiBusy: busy === index,
    onAiWrite: async () => {
      const title = item.position || item.role || item.title;
      if (!title) return toast.info(`Add a ${kind === "job" ? "job title" : "title"} first so AI knows what to write.`);
      setBusy(index);
      try {
        const { bullets } = await suggestBullets({
          title,
          organization: item.company || item.organization || "",
          field: field.label,
          kind,
          existing: item.description || "",
        });
        const merged = [item.description, ...(bullets || [])].filter(Boolean).join("\n");
        setValue(merged);
        toast.success("AI added suggestions — edit them to make them yours.");
      } catch (error) {
        toast.error(error?.response?.data?.message || "AI couldn't write bullets right now");
      } finally {
        setBusy(-1);
      }
    },
  });

  return bulletProps;
}

export function SummarySection() {
  const { data, setData, field } = useEditor();
  return (
    <TextArea
      id="summary"
      label="Professional summary"
      rows={5}
      placeholder={`e.g. ${field.summary}`}
      hint="2–3 sentences: who you are, your strongest skills and the role you want. AI Enhance can polish it."
      value={data.summary || ""}
      onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
    />
  );
}

export function ExperienceSection() {
  const { data, setData, field } = useEditor();
  const bulletProps = useAiBullets();
  return (
    <EntryListForm
      items={data.experience}
      onChange={setKey(setData, "experience")}
      addLabel="Add experience"
      emptyText="Jobs, internships, freelance or part-time work — most recent first."
      blank={{ position: "", company: "", location: "", type: "", startDate: "", endDate: "", current: false, description: "" }}
      titleOf={(e) => e.position || e.company}
      subtitleOf={(e) => join(e.position && e.company, e.current ? "Present" : "")}
      renderExtra={{ bulletProps: (item, i, set) => bulletProps(item, i, set, "job") }}
      fields={[
        { name: "position", label: "Job title", placeholder: field.title },
        { name: "company", label: "Employer", placeholder: "Company or organisation" },
        { name: "location", label: "Location", placeholder: "City, Country" },
        { name: "type", label: "Employment type", type: "select", options: EMPLOYMENT_TYPES },
        { name: "startDate", label: "Start date", type: "month" },
        { name: "endDate", label: "End date", type: "month", disabledBy: "current" },
        { name: "current", label: "I currently work here", type: "current", clears: "endDate" },
        { name: "description", label: "Key achievements", type: "bullets", placeholder: field.bullet },
      ]}
    />
  );
}

export function EducationSection() {
  const { data, setData } = useEditor();
  return (
    <EntryListForm
      items={data.education}
      onChange={setKey(setData, "education")}
      addLabel="Add education"
      emptyText="Universities, colleges, schools, diplomas or vocational training."
      blank={{ degree: "", fieldOfStudy: "", institute: "", location: "", startYear: "", endYear: "", current: false, grade: "", honors: "", coursework: "" }}
      titleOf={(e) => e.degree || e.institute}
      subtitleOf={(e) => (e.degree ? e.institute : "")}
      fields={[
        { name: "degree", label: "Degree / qualification", placeholder: "BSc, Diploma, A-Levels, Certificate…" },
        { name: "fieldOfStudy", label: "Field of study", placeholder: "Nursing, Business, Computer Science…" },
        { name: "institute", label: "School / institution", placeholder: "University or college name" },
        { name: "location", label: "Location", placeholder: "City, Country" },
        { name: "startYear", label: "Start", type: "month" },
        { name: "endYear", label: "End (or expected)", type: "month", disabledBy: "current" },
        { name: "current", label: "I'm currently studying here", type: "current", clears: "endYear" },
        { name: "grade", label: "Grade / GPA", placeholder: "3.8/4.0, First Class, 85%…" },
        { name: "honors", label: "Honours & activities", placeholder: "Dean's list, Head of debate club…" },
        { name: "coursework", label: "Relevant coursework", placeholder: "Comma-separated, optional", span: 2 },
      ]}
    />
  );
}

export function ProjectsSection() {
  const { data, setData } = useEditor();
  const bulletProps = useAiBullets();
  return (
    <EntryListForm
      items={data.projects}
      onChange={setKey(setData, "projects")}
      addLabel="Add project"
      emptyText="Work, academic, personal or community projects — anything that shows what you can do."
      blank={{ title: "", role: "", link: "", description: "" }}
      titleOf={(p) => p.title}
      subtitleOf={(p) => p.role}
      renderExtra={{ bulletProps: (item, i, set) => bulletProps(item, i, set, "project") }}
      fields={[
        { name: "title", label: "Project name", placeholder: "Community health campaign, Store redesign…" },
        { name: "role", label: "Your role", placeholder: "Lead, Coordinator, Designer…" },
        { name: "link", label: "Link (optional)", placeholder: "portfolio.com/project", span: 2 },
        { name: "description", label: "What you did & the result", type: "bullets", placeholder: "Led a team of 5 to deliver… resulting in…" },
      ]}
    />
  );
}

export function CertificationsSection() {
  const { data, setData } = useEditor();
  return (
    <EntryListForm
      items={data.certifications}
      onChange={setKey(setData, "certifications")}
      addLabel="Add certification or licence"
      emptyText="Professional licences, certificates and accreditations (e.g. RN licence, PMP, CPA, food hygiene)."
      blank={{ name: "", issuer: "", date: "", expiry: "", credentialId: "" }}
      titleOf={(c) => c.name}
      subtitleOf={(c) => c.issuer}
      fields={[
        { name: "name", label: "Name", placeholder: "Registered Nurse Licence, PMP…" },
        { name: "issuer", label: "Issuing organisation", placeholder: "Nursing Council, PMI, Google…" },
        { name: "date", label: "Issued", type: "month" },
        { name: "expiry", label: "Expires (optional)", type: "month" },
        { name: "credentialId", label: "Credential / licence ID (optional)", placeholder: "ABC-12345", span: 2 },
      ]}
    />
  );
}

export function VolunteeringSection() {
  const { data, setData } = useEditor();
  const bulletProps = useAiBullets();
  return (
    <EntryListForm
      items={data.volunteering}
      onChange={setKey(setData, "volunteering")}
      addLabel="Add volunteering"
      emptyText="Charity, community, religious or student organisation work."
      blank={{ role: "", organization: "", startDate: "", endDate: "", current: false, description: "" }}
      titleOf={(v) => v.role || v.organization}
      subtitleOf={(v) => (v.role ? v.organization : "")}
      renderExtra={{ bulletProps: (item, i, set) => bulletProps(item, i, set, "volunteer") }}
      fields={[
        { name: "role", label: "Role", placeholder: "Volunteer tutor" },
        { name: "organization", label: "Organisation", placeholder: "Red Crescent, Local food bank…" },
        { name: "startDate", label: "Start", type: "month" },
        { name: "endDate", label: "End", type: "month", disabledBy: "current" },
        { name: "current", label: "I currently volunteer here", type: "current", clears: "endDate" },
        { name: "description", label: "What you did", type: "bullets", placeholder: "Taught weekly maths sessions to 15 children" },
      ]}
    />
  );
}

export function AwardsSection() {
  const { data, setData } = useEditor();
  return (
    <EntryListForm
      items={data.awards}
      onChange={setKey(setData, "awards")}
      addLabel="Add award"
      emptyText="Awards, scholarships, competitions or recognition at work."
      blank={{ title: "", issuer: "", date: "", description: "" }}
      titleOf={(a) => a.title}
      subtitleOf={(a) => a.issuer}
      fields={[
        { name: "title", label: "Award", placeholder: "Employee of the Year" },
        { name: "issuer", label: "Awarded by", placeholder: "Organisation" },
        { name: "date", label: "Date", type: "month" },
        { name: "description", label: "Why you received it (optional)", type: "textarea", placeholder: "Recognised for…" },
      ]}
    />
  );
}

export function CoursesSection() {
  const { data, setData } = useEditor();
  return (
    <EntryListForm
      items={data.courses}
      onChange={setKey(setData, "courses")}
      addLabel="Add course"
      emptyText="Online courses, workshops, bootcamps or in-house training."
      blank={{ name: "", institution: "", date: "" }}
      titleOf={(c) => c.name}
      subtitleOf={(c) => c.institution}
      fields={[
        { name: "name", label: "Course", placeholder: "Advanced Excel, First Aid at Work…" },
        { name: "institution", label: "Provider", placeholder: "Coursera, Red Cross…" },
        { name: "date", label: "Completed", type: "month" },
      ]}
    />
  );
}

export function PublicationsSection() {
  const { data, setData } = useEditor();
  return (
    <EntryListForm
      items={data.publications}
      onChange={setKey(setData, "publications")}
      addLabel="Add publication"
      emptyText="Papers, articles, books or conference talks."
      blank={{ title: "", publisher: "", date: "", url: "" }}
      titleOf={(p) => p.title}
      subtitleOf={(p) => p.publisher}
      fields={[
        { name: "title", label: "Title", placeholder: "Title of the work", span: 2 },
        { name: "publisher", label: "Publisher / journal", placeholder: "Journal, magazine, conference…" },
        { name: "date", label: "Date", type: "month" },
        { name: "url", label: "Link (optional)", placeholder: "doi.org/…", span: 2 },
      ]}
    />
  );
}

export function MembershipsSection() {
  const { data, setData } = useEditor();
  return (
    <EntryListForm
      items={data.memberships}
      onChange={setKey(setData, "memberships")}
      addLabel="Add membership"
      emptyText="Professional bodies, associations or unions."
      blank={{ name: "", role: "", startDate: "", endDate: "", current: true }}
      titleOf={(m) => m.name}
      subtitleOf={(m) => m.role}
      fields={[
        { name: "name", label: "Organisation", placeholder: "Institution of Civil Engineers" },
        { name: "role", label: "Membership / role", placeholder: "Chartered member" },
        { name: "startDate", label: "Since", type: "month" },
        { name: "endDate", label: "Until", type: "month", disabledBy: "current" },
        { name: "current", label: "Current member", type: "current", clears: "endDate" },
      ]}
    />
  );
}

const LEVEL_DOTS = SKILL_LEVELS.slice(1);

export function SkillsSection() {
  const { data, setData, field } = useEditor();
  const [cat, setCat] = useState("professional");
  const skills = data.skills || [];
  const inCat = skills.filter((s) => (s.category || "professional") === cat);

  const setSkills = (next) => setData((p) => ({ ...p, skills: next }));
  const addNames = (names) => {
    const existing = new Set(skills.map((s) => s.name.toLowerCase()));
    const fresh = names.filter((n) => n.trim() && !existing.has(n.trim().toLowerCase())).map((n) => ({ name: n.trim(), level: "", category: cat }));
    if (fresh.length) setSkills([...skills, ...fresh]);
  };
  const updateSkill = (skill, patch) => setSkills(skills.map((s) => (s === skill ? { ...s, ...patch } : s)));
  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const suggestions = (cat === "soft" ? SOFT_SKILLS : field.skills).filter((s) => !skills.some((x) => x.name.toLowerCase() === s.toLowerCase()));

  return (
    <div className="space-y-5">
      <Segmented options={SKILL_CATEGORIES.map((c) => ({ value: c.id, label: `${c.label} (${skills.filter((s) => (s.category || "professional") === c.id).length})` }))} value={cat} onChange={setCat} layoutId="skill-cat" />

      <ChipInput id="skill-input" values={[]} onChange={(vals) => addNames(vals)} placeholder={cat === "soft" ? "e.g. Leadership" : `e.g. ${field.skills[0]}`} />

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {inCat.map((s) => (
            <motion.div key={s.name} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex items-center gap-3 rounded-2xl border border-white bg-white/60 px-4 py-2.5">
              <span className="min-w-0 flex-1 truncate font-medium text-ink">{s.name}</span>
              <div className="flex items-center gap-1" role="radiogroup" aria-label={`${s.name} level`}>
                {LEVEL_DOTS.map((lvl, i) => {
                  const on = LEVEL_DOTS.indexOf(s.level) >= i;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      role="radio"
                      aria-checked={s.level === lvl}
                      title={lvl}
                      onClick={() => updateSkill(s, { level: s.level === lvl ? "" : lvl })}
                      className={`h-3 w-6 rounded-full transition ${on ? "bg-brand" : "bg-violet/15 hover:bg-violet/30"}`}
                    />
                  );
                })}
                <span className="ml-2 hidden w-20 text-xs text-ink-soft sm:inline">{s.level || "No level"}</span>
              </div>
              <button type="button" onClick={() => removeSkill(s)} className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-rose-50 hover:text-rose-500" aria-label={`Remove ${s.name}`}>
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {!inCat.length && <p className="rounded-2xl border-2 border-dashed border-violet/20 px-4 py-6 text-center text-sm text-ink-soft">No skills here yet — type above or tap a suggestion.</p>}
      </div>

      {suggestions.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">Suggested for {cat === "soft" ? "everyone" : field.label}</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 12).map((s) => (
              <button key={s} type="button" onClick={() => addNames([s])} className="inline-flex items-center gap-1 rounded-full border border-dashed border-violet/30 bg-white/50 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-violet hover:bg-white hover:text-violet">
                <Plus size={12} /> {s}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-ink-soft">Tip: levels are optional — many templates show them as dots. Aim for 6–12 skills that match the job post.</p>
    </div>
  );
}

export function LanguagesSection() {
  const { data, setData } = useEditor();
  const langs = data.languages || [];
  const set = (next) => setData((p) => ({ ...p, languages: next }));
  const [draft, setDraft] = useState("");

  const add = () => {
    const name = draft.trim();
    if (!name || langs.some((l) => l.name.toLowerCase() === name.toLowerCase())) return setDraft("");
    set([...langs, { name, level: langs.length ? "Intermediate" : "Native" }]);
    setDraft("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="field flex-1"
          value={draft}
          placeholder="e.g. English, Urdu, Arabic, French…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          aria-label="Language"
        />
        <button type="button" onClick={add} className="btn btn-primary">
          <Plus size={16} /> Add
        </button>
      </div>
      <AnimatePresence initial={false}>
        {langs.map((l, i) => (
          <motion.div key={l.name} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 rounded-2xl border border-white bg-white/60 p-4 sm:flex-row sm:items-center">
            <span className="flex-1 font-display text-lg font-bold text-ink">{l.name}</span>
            <Segmented size="sm" layoutId={`lang-${i}`} options={LANGUAGE_LEVELS} value={l.level} onChange={(v) => set(langs.map((x, j) => (j === i ? { ...x, level: v } : x)))} />
            <button type="button" onClick={() => set(langs.filter((_, j) => j !== i))} className="grid h-8 w-8 place-items-center self-end rounded-full text-ink-soft hover:bg-rose-50 hover:text-rose-500 sm:self-auto" aria-label={`Remove ${l.name}`}>
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function InterestsSection() {
  const { data, setData } = useEditor();
  return (
    <ChipInput
      id="interests"
      values={data.interests || []}
      onChange={(interests) => setData((p) => ({ ...p, interests }))}
      placeholder="e.g. Marathon running, Photography, Chess"
      suggestions={["Reading", "Travel", "Photography", "Cooking", "Football", "Running", "Volunteering", "Music", "Chess", "Hiking"]}
    />
  );
}

export function ReferencesSection() {
  const { data, setData } = useEditor();
  const refs = data.references || { mode: "request", items: [] };
  const set = (patch) => setData((p) => ({ ...p, references: { ...refs, ...patch } }));
  return (
    <div className="space-y-5">
      <Segmented
        layoutId="ref-mode"
        options={[
          { value: "request", label: "“Available upon request”" },
          { value: "list", label: "List references" },
        ]}
        value={refs.mode}
        onChange={(mode) => set({ mode })}
      />
      {refs.mode === "list" && (
        <EntryListForm
          items={refs.items}
          onChange={(items) => set({ items })}
          addLabel="Add reference"
          emptyText="Former managers, supervisors or teachers — always ask permission first."
          blank={{ name: "", title: "", company: "", contact: "" }}
          titleOf={(r) => r.name}
          subtitleOf={(r) => join(r.title, r.company)}
          fields={[
            { name: "name", label: "Full name", placeholder: "Dr. Sarah Ahmed" },
            { name: "title", label: "Job title", placeholder: "Head of Nursing" },
            { name: "company", label: "Organisation", placeholder: "City Hospital" },
            { name: "contact", label: "Email or phone", placeholder: "sarah@hospital.org" },
          ]}
        />
      )}
    </div>
  );
}
