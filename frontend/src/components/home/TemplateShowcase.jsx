import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { useState } from "react";

const templates = [
  {
    name: "Modern",
    description: "Professional & Clean",
    color: "from-cyan-500 to-sky-500",
  },
  {
    name: "ATS Classic",
    description: "Recruiter Friendly",
    color: "from-indigo-500 to-violet-500",
  },
  {
    name: "Creative",
    description: "Designer Style",
    color: "from-pink-500 to-fuchsia-500",
  },
  {
    name: "Executive",
    description: "Corporate Resume",
    color: "from-emerald-500 to-teal-500",
  },
  {
    name: "Developer",
    description: "Dark Tech Theme",
    color: "from-slate-700 to-slate-900",
  },
];

export default function TemplateShowcase() {
  const [page, setPage] = useState(0);

  const visible = templates.slice(
    page * 3,
    page * 3 + 3
  );

  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        {/* Heading */}

        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">

              Resume Templates

            </span>

            <h2 className="mt-5 text-5xl font-black text-slate-950">

              Choose Your Style

            </h2>

            <p className="mt-4 max-w-xl text-lg text-slate-500">

              Every template is ATS friendly,
              professionally designed and ready
              to impress recruiters.

            </p>

          </div>

          <div className="flex gap-3">

            <button
              onClick={() =>
                setPage(
                  Math.max(
                    page - 1,
                    0
                  )
                )
              }
              className="rounded-2xl border bg-white p-4 shadow transition hover:bg-cyan-500 hover:text-white"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() =>
                setPage(
                  Math.min(
                    page + 1,
                    1
                  )
                )
              }
              className="rounded-2xl border bg-white p-4 shadow transition hover:bg-cyan-500 hover:text-white"
            >
              <ChevronRight />
            </button>

          </div>

        </div>

        {/* Cards */}

        <div className="grid gap-8 lg:grid-cols-3">

          {visible.map((template) => (

            <div
              key={template.name}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
            >

              {/* Resume Preview */}

              <div className="relative h-80 overflow-hidden bg-slate-100">

                <div
                  className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${template.color}`}
                />

                <div className="scale-[0.52] origin-top-left p-6">

                  <div className="w-[540px] rounded-3xl bg-white p-8 shadow-xl">

                    <div className="mb-6 flex items-center justify-between">

                      <div>

                        <div className="h-5 w-52 rounded bg-slate-900"></div>

                        <div className="mt-3 h-3 w-32 rounded bg-slate-300"></div>

                      </div>

                      <div
                        className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${template.color}`}
                      />

                    </div>

                    <div className="grid grid-cols-3 gap-6">

                      <div>

                        <div className="mb-4 h-3 w-20 rounded bg-slate-800"></div>

                        <div className="space-y-2">

                          <div className="h-2 rounded bg-slate-300"></div>
                          <div className="h-2 rounded bg-slate-300"></div>
                          <div className="h-2 rounded bg-slate-300"></div>
                          <div className="h-2 rounded bg-slate-300"></div>

                        </div>

                      </div>

                      <div className="col-span-2">

                        <div className="mb-4 h-3 w-28 rounded bg-slate-800"></div>

                        <div className="space-y-3">

                          <div className="h-16 rounded-xl bg-slate-100"></div>

                          <div className="h-16 rounded-xl bg-slate-100"></div>

                          <div className="h-16 rounded-xl bg-slate-100"></div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Footer */}

              <div className="p-6">

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="text-2xl font-bold">

                    {template.name}

                  </h3>

                  <Sparkles
                    className="text-cyan-500"
                    size={20}
                  />

                </div>

                <p className="text-slate-500">

                  {template.description}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}