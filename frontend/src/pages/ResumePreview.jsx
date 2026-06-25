import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import DashboardLayout from "../layouts/DashboardLayout";

import {
  Sparkles,
  FileText,
  FileDown,
} from "lucide-react";

import { downloadDocx } from "../utils/downloadDocx";

import {
  getResume,
  updateResume,
} from "../services/resumeApi";

import { Button } from "@/components/ui/button";

import { useReactToPrint } from "react-to-print";

import ModernTemplate from "../components/templates/ModernTemplate";
import ATSClassicTemplate from "../components/templates/ATSClassicTemplate";
import CreativeTemplate from "../components/templates/CreativeTemplate";

import ExecutiveTemplate from "../components/templates/ExecutiveTemplate";
import DeveloperTemplate from "../components/templates/DeveloperTemplate";
import {
  enhanceResume,
} from "../services/geminiApi";



export default function ResumePreview() {




  const { id } =
    useParams();

  const [resume, setResume] =
    useState(null);

  const [enhancing, setEnhancing] =
    useState(false);

    const resumeRef =
  useRef(null);

const handlePrint =
  useReactToPrint({
    contentRef:
      resumeRef,
    documentTitle:
      resume?.personalInfo
        ?.fullName ||
      "Resume",
  });


  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume =
    async () => {
      try {
        const data =
          await getResume(id);

        setResume(data);
      } catch (error) {
        console.log(error);
      }
    };

  const handleEnhance =
  async () => {
    try {
      setEnhancing(true);

      const result =
        await enhanceResume(
          resume
        );

      console.log(
        "RAW AI RESPONSE:"
      );

      console.log(
        result.enhanced
      );

      let enhancedData;

      try {
        const cleaned =
          result.enhanced
            .replace(
              /```json/g,
              ""
            )
            .replace(
              /```/g,
              ""
            )
            .trim();

        console.log(
          "CLEANED RESPONSE:"
        );

        console.log(
          cleaned
        );

        enhancedData =
          JSON.parse(
            cleaned
          );
      } catch (
        parseError
      ) {
        console.log(
          parseError
        );

        alert(
          "AI returned invalid format"
        );

        setEnhancing(
          false
        );

        return;
      }

      await updateResume(
  resume._id,
  enhancedData
);

setResume(
  enhancedData
);

      setEnhancing(
        false
      );

      alert(
        "Resume Enhanced Successfully"
      );
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data
          ?.message ||
          "AI Enhancement Failed"
      );

      setEnhancing(
        false
      );
    }
  };

  if (!resume) {
    return (
      <DashboardLayout>
        Loading...
      </DashboardLayout>
    );
  }

  const renderTemplate =
  () => {
    switch (
      resume.template
    ) {
      case "ats":
        return (
          <ATSClassicTemplate
            data={resume}
          />
        );

      case "creative":
        return (
          <CreativeTemplate
            data={resume}
          />
        );

      case "executive":
        return (
          <ExecutiveTemplate
            data={resume}
          />
        );

      case "developer":
        return (
          <DeveloperTemplate
            data={resume}
          />
        );

      default:
        return (
          <ModernTemplate
            data={resume}
          />
        );
    }
  };

  

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap gap-5">

  {/* AI Button */}

  <Button
    onClick={handleEnhance}
    disabled={enhancing}
    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-8 py-7 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(99,102,241,.55)]"
  >
    <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>

    <span className="relative flex items-center gap-3 text-base font-semibold">

      <Sparkles
        size={20}
        className={
          enhancing
            ? "animate-spin"
            : ""
        }
      />

      {enhancing
        ? "Enhancing Resume..."
        : "Enhance with AI"}

    </span>
  </Button>

  {/* PDF */}

  <Button
    onClick={handlePrint}
    variant="outline"
    className="group rounded-2xl border-2 border-emerald-400 bg-white px-8 py-7 font-semibold text-emerald-600 shadow-lg transition-all duration-300 hover:scale-105 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_35px_rgba(16,185,129,.5)]"
  >
    <span className="flex items-center gap-3">

      <FileText size={20} />

      Download PDF

    </span>
  </Button>

  {/* DOCX */}

  <Button
  onClick={() =>
    downloadDocx(resume)
  }
    variant="outline"
    className="group rounded-2xl border-2 border-sky-400 bg-white px-8 py-7 font-semibold text-sky-600 shadow-lg transition-all duration-300 hover:scale-105 hover:border-sky-500 hover:bg-sky-500 hover:text-white hover:shadow-[0_0_35px_rgba(14,165,233,.5)]"
  >
    <span className="flex items-center gap-3">

      <FileDown size={20} />

      Download DOCX

    </span>
    
  </Button>

</div>

      {enhancing && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-6 rounded-xl border bg-indigo-50 p-4"
        >
          🤖 AI is improving your
          resume...
        </motion.div>
      )}

      <div ref={resumeRef}>
  {renderTemplate()}
</div>
    </DashboardLayout>
  );
}