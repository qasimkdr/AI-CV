import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import TemplateCard from "../createResume/TemplateCard";

import ModernTemplate from "./ModernTemplate";
import ATSClassicTemplate from "./ATSClassicTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import DeveloperTemplate from "./DeveloperTemplate";

export default function TemplateSelector({
  selectedTemplate,
  setResumeData,
}) {
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description:
        "Professional two-column design",
      component: ModernTemplate,
    },
    {
      id: "ats",
      name: "ATS Classic",
      description:
        "ATS-friendly recruiter format",
      component: ATSClassicTemplate,
    },
    {
      id: "creative",
      name: "Creative",
      description:
        "Stylish layout with sidebar",
      component: CreativeTemplate,
    },
    {
      id: "executive",
      name: "Executive",
      description:
        "Premium executive layout",
      component: ExecutiveTemplate,
    },
    {
      id: "developer",
      name: "Developer",
      description:
        "Dark theme for developers",
      component: DeveloperTemplate,
    },
  ];

  const PER_PAGE = 3;

  const [page, setPage] =
    useState(0);

  const totalPages =
    Math.ceil(
      templates.length /
        PER_PAGE
    );

  const visibleTemplates =
    templates.slice(
      page * PER_PAGE,
      page * PER_PAGE +
        PER_PAGE
    );

  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur-xl">

      {/* Heading */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">
            Visual Style
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Choose Template
          </h2>

        </div>

        <div className="flex gap-2">

          <button
            type="button"
            disabled={
              page === 0
            }
            onClick={() =>
              setPage(
                page - 1
              )
            }
            className="rounded-xl border p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft
              size={22}
            />
          </button>

          <button
            type="button"
            disabled={
              page ===
              totalPages - 1
            }
            onClick={() =>
              setPage(
                page + 1
              )
            }
            className="rounded-xl border p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight
              size={22}
            />
          </button>

        </div>

      </div>

      <AnimatePresence
        mode="wait"
      >

        <motion.div
          key={page}
          initial={{
            x: 150,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: -150,
            opacity: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="grid gap-6 md:grid-cols-3"
        >

          {visibleTemplates.map(
            (
              template
            ) => (
              <TemplateCard
                key={
                  template.id
                }
                template={
                  template
                }
                selectedTemplate={
                  selectedTemplate
                }
                setResumeData={
                  setResumeData
                }
              />
            )
          )}

        </motion.div>

      </AnimatePresence>

      <div className="mt-6 flex justify-center gap-2">

        {Array.from({
          length:
            totalPages,
        }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              page === i
                ? "w-8 bg-sky-500"
                : "w-2 bg-slate-300"
            }`}
          />
        ))}

      </div>

    </div>
  );
}