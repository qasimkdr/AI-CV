import { AnimatePresence, motion } from "framer-motion";
import { Link2, Plus, X } from "lucide-react";

import { Field, MonthPicker, PhotoUpload, SelectField, Toggle } from "../inputs";
import { useEditor } from "../EditorContext";
import { LINK_TYPES } from "../../../lib/sections";

export default function PersonalSection() {
  const { data, setData, field } = useEditor();
  const p = data.personalInfo;

  const set = (patch) => setData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, ...patch } }));
  const setDetails = (patch) => set({ details: { ...p.details, ...patch } });
  const links = p.links || [];
  const setLinks = (next) => set({ links: next });

  return (
    <div className="space-y-7">
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="pi-name" label="Full name" autoComplete="name" placeholder="Jane Doe" value={p.fullName || ""} onChange={(e) => set({ fullName: e.target.value })} />
        <Field id="pi-title" label="Job title / headline" autoComplete="organization-title" placeholder={field.title} value={p.title || ""} onChange={(e) => set({ title: e.target.value })} />
        <Field id="pi-email" type="email" label="Email" autoComplete="email" placeholder="jane@example.com" value={p.email || ""} onChange={(e) => set({ email: e.target.value })} />
        <Field id="pi-phone" type="tel" label="Phone" autoComplete="tel" placeholder="+1 555 123 4567" value={p.phone || ""} onChange={(e) => set({ phone: e.target.value })} />
        <Field id="pi-address" label="Location" autoComplete="address-level2" placeholder="City, Country" className="md:col-span-2" value={p.address || ""} onChange={(e) => set({ address: e.target.value })} />
      </div>

      {/* Links */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-medium text-ink">
            <Link2 size={15} className="text-violet" /> Links
          </p>
          <span className="text-xs text-ink-soft">LinkedIn, portfolio, website…</span>
        </div>
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {links.map((l, i) => (
              <motion.div key={i} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-[130px_1fr_auto] items-end gap-2">
                <SelectField id={`link-type-${i}`} label={i === 0 ? "Type" : ""} options={LINK_TYPES} value={l.label} onChange={(v) => setLinks(links.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
                <Field id={`link-url-${i}`} label={i === 0 ? "URL" : ""} placeholder="linkedin.com/in/janedoe" value={l.url || ""} onChange={(e) => setLinks(links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
                <button type="button" onClick={() => setLinks(links.filter((_, j) => j !== i))} className="mb-1.5 grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-rose-50 hover:text-rose-500" aria-label="Remove link">
                  <X size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {["LinkedIn", "Portfolio", "Website", "GitHub", "Behance"]
            .filter((t) => !links.some((l) => l.label === t))
            .map((t) => (
              <button key={t} type="button" onClick={() => setLinks([...links, { label: t, url: "" }])} className="inline-flex items-center gap-1 rounded-full border border-dashed border-violet/30 bg-white/50 px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:border-violet hover:text-violet">
                <Plus size={12} /> {t}
              </button>
            ))}
        </div>
      </div>

      {/* Photo */}
      <div className="rounded-3xl border border-white bg-white/50 p-5">
        <Toggle checked={Boolean(p.showPhoto)} onChange={(v) => set({ showPhoto: v })} label="Add a photo" description="Shown by templates that support photos (not the ATS template)." />
        <AnimatePresence initial={false}>
          {p.showPhoto && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-4">
                <PhotoUpload value={p.photo} onChange={(photo) => set({ photo })} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Personal details */}
      <div className="rounded-3xl border border-white bg-white/50 p-5">
        <Toggle checked={Boolean(p.showDetails)} onChange={(v) => set({ showDetails: v })} label="Add personal details" description="Date of birth, nationality, visa, driving licence — expected in some countries, best left off in others." />
        <AnimatePresence initial={false}>
          {p.showDetails && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid gap-4 pt-4 md:grid-cols-2">
                <MonthPicker id="pi-dob" label="Date of birth (month/year)" value={p.details?.dateOfBirth || ""} onChange={(v) => setDetails({ dateOfBirth: v })} />
                <Field id="pi-nat" label="Nationality" placeholder="Pakistani" value={p.details?.nationality || ""} onChange={(e) => setDetails({ nationality: e.target.value })} />
                <Field id="pi-visa" label="Visa / work permit" placeholder="UAE residence visa" value={p.details?.visaStatus || ""} onChange={(e) => setDetails({ visaStatus: e.target.value })} />
                <Field id="pi-dl" label="Driving licence" placeholder="Full UK licence" value={p.details?.drivingLicense || ""} onChange={(e) => setDetails({ drivingLicense: e.target.value })} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
