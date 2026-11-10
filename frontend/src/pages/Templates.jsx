import { Link } from "react-router-dom";
import { ArrowRight, Check, LayoutTemplate } from "lucide-react";

import PublicLayout from "../layouts/PublicLayout";
import Seo from "../components/seo/Seo";
import SectionHeading from "../components/home/SectionHeading";
import Reveal from "../components/motion/Reveal";
import TiltCard from "../components/motion/TiltCard";
import TemplateThumb from "../components/templates/TemplateThumb";
import CTA from "../components/home/CTA";
import { TEMPLATES } from "../lib/templates";
import { getAuthToken } from "../lib/authStorage";

export default function Templates() {
  const loggedIn = Boolean(getAuthToken());

  return (
    <PublicLayout>
      <Seo />
      <section className="px-4 pb-10 pt-32 sm:px-6 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="eyebrow">
                <LayoutTemplate size={13} /> Free resume templates
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] text-ink sm:text-6xl">
                ATS-friendly resume templates <span className="text-gradient">that get noticed</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                Choose a professionally designed template, fill it in with help
                from AI, and download it as PDF or Word. Switch designs any time
                — your content always comes with you.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 0.08} as="article" id={t.id} className="scroll-mt-28">
                <TiltCard max={7} className="glass group h-full rounded-[2rem] p-3">
                  <div className="overflow-hidden rounded-[1.5rem] ring-1 ring-black/5">
                    <div className="transition duration-700 group-hover:scale-[1.03]">
                      <TemplateThumb template={t.component} aspect={1.32} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-ink">{t.name}</h2>
                      <span className={`h-3.5 w-3.5 rounded-full bg-gradient-to-br ${t.accent}`} />
                    </div>
                    <p className="mt-2 text-ink-soft">{t.description}</p>
                    <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-ink">
                      <Check size={15} className="text-emerald-500" /> Best for: {t.bestFor}
                    </p>
                    <Link
                      to={loggedIn ? `/create-resume?template=${t.id}` : `/signup?template=${t.id}`}
                      className="btn btn-primary mt-5 w-full"
                    >
                      Use {t.name} template <ArrowRight size={16} />
                    </Link>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="What makes a resume template ATS-friendly?"
            subtitle="Applicant Tracking Systems scan resumes before people do. Every AI CV template follows the rules that keep you visible."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["Readable structure", "Clear headings like Experience, Education and Skills that parsers recognise instantly."],
              ["Real, selectable text", "No text baked into images — every word can be read, searched and matched to keywords."],
              ["Clean typography", "Standard fonts and consistent spacing that survive conversion to PDF and DOCX."],
            ].map(([title, text], i) => (
              <Reveal key={title} delay={i * 0.08} className="glass rounded-3xl p-7">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand font-display font-bold text-white">{i + 1}</span>
                <h3 className="mt-4 text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </PublicLayout>
  );
}
