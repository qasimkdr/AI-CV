import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Save,
  Sparkles,
  Wand2,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import PersonalInfoForm from "../components/resume/PersonalInfoForm";
import EducationForm from "../components/resume/EducationForm";
import ExperienceForm from "../components/resume/ExperienceForm";
import SkillsForm from "../components/resume/SkillsForm";
import ProjectsForm from "../components/resume/ProjectsForm";
import CertificationsForm from "../components/resume/CertificationsForm";

import TemplateSelector from "../components/templates/TemplateSelector";

import { Button } from "@/components/ui/button";

import {
  createResume,
  getResumes,
} from "../services/resumeApi";

export default function CreateResume() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [resumeData, setResumeData] =
    useState({
      template: "modern",

      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        github: "",
      },

      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
    });

  useEffect(() => {
    loadLatestResume();
  }, []);

  const loadLatestResume =
    async () => {
      try {
        const resumes =
          await getResumes();

        if (
          resumes &&
          resumes.length > 0
        ) {
          const latestResume =
            resumes[0];

          setResumeData({
            template:
              latestResume.template ||
              "modern",

            personalInfo:
              latestResume.personalInfo ||
              {},

            education:
              latestResume.education ||
              [],

            experience:
              latestResume.experience ||
              [],

            skills:
              latestResume.skills ||
              [],

            projects:
              latestResume.projects ||
              [],

            certifications:
              latestResume.certifications ||
              [],
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleSave = async () => {
    try {
      const savedResume =
        await createResume(
          resumeData
        );

      navigate(
        `/resume-preview/${savedResume._id}`
      );
    } catch (error) {
      console.log(error);

      alert(
        "Failed To Save Resume"
      );
    }
  };

  const completionItems = [
    {
      label: "Personal",
      done: Boolean(
        resumeData.personalInfo
          ?.fullName
      ),
    },
    {
      label: "Skills",
      done:
        resumeData.skills.length >
        0,
    },
    {
      label: "Experience",
      done:
        resumeData.experience
          .length > 0,
    },
    {
      label: "Projects",
      done:
        resumeData.projects.length >
        0,
    },
  ];

  const completed =
    completionItems.filter(
      (item) => item.done
    ).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid min-h-[520px] place-items-center rounded-2xl border border-white/70 bg-white/70 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-slate-950" />
            <p className="font-semibold text-slate-600">
              Loading resume studio...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.section
          initial={{
            opacity: 0,
            y: 24,
            rotateX: 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          transition={{
            duration: 0.55,
            ease: "easeOut",
          }}
          className="relative overflow-hidden rounded-2xl border border-white/70 bg-slate-950 p-6 text-white shadow-2xl shadow-sky-900/20 md:p-8"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.42),transparent_30%),radial-gradient(circle_at_82%_72%,rgba(52,211,153,0.30),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_36%,rgba(255,255,255,0.08))]" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-sky-100 backdrop-blur">
                <Sparkles size={16} />
                Resume creation studio
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Shape your resume in one focused 3D workspace.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                Choose a template, fill each section, then save to preview and enhance with AI.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-black/20 transition hover:-translate-y-0.5"
                >
                  <Save size={18} />
                  Save Resume
                </button>

                <a
                  href="#resume-form"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Start Editing
                  <ArrowRight size={17} />
                </a>
              </div>
            </div>

            <motion.div
              animate={{
                y: [0, -12, 0],
                rotateY: [0, -4, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl"
              style={{
                transform:
                  "translateZ(42px) rotateX(5deg)",
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-sky-400 to-emerald-300 text-slate-950">
                  <Wand2 size={24} />
                </div>
                <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs text-emerald-100">
                  {completed}/
                  {completionItems.length} ready
                </span>
              </div>

              <div className="space-y-3">
                {completionItems.map(
                  (item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3"
                    >
                      <span className="text-sm font-semibold">
                        {item.label}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          item.done
                            ? "bg-emerald-300"
                            : "bg-white/30"
                        }`}
                      />
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </div>
        </motion.section>

        <section
          id="resume-form"
          className="grid gap-8 xl:grid-cols-[1fr_320px]"
        >
          <div className="space-y-6">
            <TemplateSelector
              selectedTemplate={
                resumeData.template
              }
              setResumeData={
                setResumeData
              }
            />

            <PersonalInfoForm
              data={
                resumeData.personalInfo
              }
              setResumeData={
                setResumeData
              }
            />

            <EducationForm
              data={
                resumeData.education
              }
              setResumeData={
                setResumeData
              }
            />

            <ExperienceForm
              data={
                resumeData.experience
              }
              setResumeData={
                setResumeData
              }
            />

            <SkillsForm
              data={resumeData.skills}
              setResumeData={
                setResumeData
              }
            />

            <ProjectsForm
              data={
                resumeData.projects
              }
              setResumeData={
                setResumeData
              }
            />

            <CertificationsForm
              data={
                resumeData.certifications
              }
              setResumeData={
                setResumeData
              }
            />
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-28 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-slate-950 text-white">
                <FileText size={22} />
              </div>

              <h2 className="text-lg font-black text-slate-950">
                Build checklist
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                A strong resume usually has personal details, a compact skills list, experience, and one or two projects.
              </p>

              <div className="mt-5 space-y-3">
                {completionItems.map(
                  (item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/70 px-4 py-3"
                    >
                      <span className="text-sm font-semibold text-slate-700">
                        {item.label}
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          item.done
                            ? "bg-emerald-400"
                            : "bg-slate-200"
                        }`}
                      />
                    </div>
                  )
                )}
              </div>

              <Button
                onClick={handleSave}
                className="mt-6 h-11 w-full bg-slate-950 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
              >
                <Save size={17} />
                Save Resume
              </Button>
            </div>
          </aside>
        </section>

        <div className="sticky bottom-4 z-20 flex justify-end xl:hidden">
          <Button
            onClick={handleSave}
            className="h-11 bg-slate-950 px-6 text-white shadow-2xl shadow-slate-900/25 hover:bg-slate-800"
          >
            <Save size={17} />
            Save Resume
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
