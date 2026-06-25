import {
  LayoutTemplate,
  PencilLine,
  Sparkles,
  Download,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: LayoutTemplate,
    title: "Choose Template",
    description:
      "Pick from beautiful ATS-friendly resume templates.",
    color: "from-cyan-500 to-sky-500",
  },
  {
    icon: PencilLine,
    title: "Fill Your Details",
    description:
      "Add your education, skills, experience and projects.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: Sparkles,
    title: "Enhance With AI",
    description:
      "Improve your resume instantly with one click.",
    color: "from-pink-500 to-fuchsia-500",
  },
  {
    icon: Download,
    title: "Download Resume",
    description:
      "Export as PDF or editable DOCX in seconds.",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-20 max-w-3xl text-center">

          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            Simple Process
          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-950">
            Create Your Resume
            In Minutes
          </h2>

          <p className="mt-5 text-lg text-slate-500">
            Four simple steps from creating
            your resume to downloading a
            professional ATS-ready CV.
          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-4">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (

              <div
                key={index}
                className="relative rounded-3xl border border-slate-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl"
              >

                {/* Number */}

                <div className="absolute right-6 top-6 text-6xl font-black text-slate-100">

                  0{index + 1}

                </div>

                {/* Icon */}

                <div
                  className={`mb-8 flex h-18 w-18 items-center justify-center rounded-3xl bg-gradient-to-r ${step.color} shadow-xl`}
                >

                  <Icon
                    className="text-white"
                    size={34}
                  />

                </div>

                <h3 className="text-2xl font-bold text-slate-900">

                  {step.title}

                </h3>

                <p className="mt-4 leading-7 text-slate-500">

                  {step.description}

                </p>

                {index !==
                  steps.length - 1 && (

                  <ArrowRight
                    className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-slate-300 lg:block"
                    size={34}
                  />

                )}

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}