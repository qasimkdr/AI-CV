import {
  Sparkles,
  FileText,
  LayoutTemplate,
  Brain,
  ShieldCheck,
  Download,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Enhancement",
    description:
      "Rewrite and improve your resume instantly with powerful AI suggestions.",
    color:
      "from-cyan-500 to-sky-500",
  },
  {
    icon: LayoutTemplate,
    title: "Premium Templates",
    description:
      "Choose from beautiful ATS-friendly resume templates for every profession.",
    color:
      "from-indigo-500 to-violet-500",
  },
  {
    icon: ShieldCheck,
    title: "ATS Optimized",
    description:
      "Designed to pass Applicant Tracking Systems used by recruiters.",
    color:
      "from-emerald-500 to-teal-500",
  },
  {
    icon: Download,
    title: "PDF & DOCX",
    description:
      "Download your resume in high-quality PDF or editable DOCX format.",
    color:
      "from-orange-500 to-red-500",
  },
  {
    icon: Sparkles,
    title: "Professional Design",
    description:
      "Create modern resumes with elegant layouts that impress employers.",
    color:
      "from-pink-500 to-fuchsia-500",
  },
  {
    icon: FileText,
    title: "Resume Management",
    description:
      "Edit, preview and manage multiple resumes from one dashboard.",
    color:
      "from-slate-700 to-slate-900",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-50 py-24">

      <div className="container mx-auto px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">

            Everything You Need

          </span>

          <h2 className="mt-6 text-5xl font-black text-slate-950">

            Build Better Resumes

          </h2>

          <p className="mt-5 text-lg text-slate-500">

            Every tool you need to create,
            improve and download professional
            resumes in minutes.

          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map(
            (feature, index) => {
              const Icon =
                feature.icon;

              return (

                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >

                  <div
                    className={`absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${feature.color} opacity-10 blur-3xl`}
                  />

                  <div
                    className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg`}
                  >

                    <Icon
                      className="text-white"
                      size={28}
                    />

                  </div>

                  <h3 className="mb-4 text-2xl font-bold text-slate-900">

                    {feature.title}

                  </h3>

                  <p className="leading-7 text-slate-500">

                    {
                      feature.description
                    }

                  </p>

                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-cyan-600 opacity-0 transition-all duration-300 group-hover:opacity-100">

                    Learn More

                    <span>→</span>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

    </section>
  );
}