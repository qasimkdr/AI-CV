import {
  useState,
  useEffect,
} from "react";

import { useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import PersonalInfoForm from "../components/resume/PersonalInfoForm";
import EducationForm from "../components/resume/EducationForm";
import ExperienceForm from "../components/resume/ExperienceForm";
import SkillsForm from "../components/resume/SkillsForm";
import ProjectsForm from "../components/resume/ProjectsForm";
import CertificationsForm from "../components/resume/CertificationsForm";

import { Button } from "@/components/ui/button";

import {
  getResume,
  updateResume,
} from "../services/resumeApi";

export default function EditResume() {
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [resumeData, setResumeData] =
    useState({
      template: "Modern",

      personalInfo: {},

      education: [],

      experience: [],

      skills: [],

      projects: [],

      certifications: [],
    });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume =
    async () => {
      try {
        const data =
          await getResume(id);

        setResumeData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  const handleUpdate =
    async () => {
      try {
        await updateResume(
          id,
          resumeData
        );

        alert(
          "Resume Updated Successfully"
        );
      } catch (error) {
        console.log(error);
      }
    };

  if (loading) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold">
          Edit Resume
        </h1>

        <PersonalInfoForm
          data={resumeData.personalInfo}
          setResumeData={setResumeData}
        />

        <EducationForm
          data={resumeData.education}
          setResumeData={setResumeData}
        />

        <ExperienceForm
          data={resumeData.experience}
          setResumeData={setResumeData}
        />

        <SkillsForm
          data={resumeData.skills}
          setResumeData={setResumeData}
        />

        <ProjectsForm
          data={resumeData.projects}
          setResumeData={setResumeData}
        />

        <CertificationsForm
          data={resumeData.certifications}
          setResumeData={setResumeData}
        />

        <Button
          onClick={handleUpdate}
          className="bg-indigo-600"
        >
          Update Resume
        </Button>
      </div>
    </DashboardLayout>
  );
}