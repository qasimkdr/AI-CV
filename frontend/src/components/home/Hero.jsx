import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  Sparkles,
  ArrowRight,
  FileText,
  Brain,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* LEFT */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">

              <Sparkles size={16} />

              AI Resume Studio

            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight text-slate-950 lg:text-6xl">

              Build resumes that
              <span className="block">

                feel sharp before

              </span>

              anyone reads them.

            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-500">

              Create ATS-friendly resumes,
              enhance them instantly using AI,
              choose beautiful templates and
              export in PDF or DOCX.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link to="/signup">

                <Button className="rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-8 py-6 text-base shadow-xl hover:scale-105 transition">

                  Get Started

                  <ArrowRight
                    className="ml-2"
                    size={18}
                  />

                </Button>

              </Link>

              <Button
                variant="outline"
                className="rounded-xl px-8 py-6"
              >

                View Templates

              </Button>

            </div>

            <div className="mt-12 flex flex-wrap gap-8">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-cyan-100 p-3">

                  <Brain className="text-cyan-600" />

                </div>

                <div>

                  <h3 className="font-bold">

                    AI Enhancement

                  </h3>

                  <p className="text-sm text-slate-500">

                    Rewrite your resume instantly

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-sky-100 p-3">

                  <FileText className="text-sky-600" />

                </div>

                <div>

                  <h3 className="font-bold">

                    ATS Friendly

                  </h3>

                  <p className="text-sm text-slate-500">

                    Built for recruiters

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 shadow-[0_30px_70px_rgba(0,0,0,.25)]">

              <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

              <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-emerald-500/10 blur-[120px]" />

              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">

                <div className="mb-6 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-cyan-400 p-3">

                      <FileText className="text-slate-900" />

                    </div>

                    <div>

                      <h3 className="font-bold text-white">

                        Live Resume

                      </h3>

                      <p className="text-xs text-slate-400">

                        ATS Ready

                      </p>

                    </div>

                  </div>

                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">

                    AI Enhanced

                  </span>

                </div>

                <div className="space-y-4">

                  <div className="h-4 w-2/3 rounded bg-slate-400"></div>

                  <div className="h-3 w-1/2 rounded bg-slate-500"></div>

                  <div className="mt-6 h-24 rounded-xl bg-cyan-500/20"></div>

                  <div className="grid grid-cols-3 gap-4">

                    <div className="h-24 rounded-xl bg-sky-500/20"></div>

                    <div className="h-24 rounded-xl bg-slate-600/40"></div>

                    <div className="h-24 rounded-xl bg-emerald-500/20"></div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}