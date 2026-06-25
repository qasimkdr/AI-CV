import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EducationForm({
  data,
  setResumeData,
}) {
  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institute: "",
          degree: "",
          startYear: "",
          endYear: "",
        },
      ],
    }));
  };

  const removeEducation = (index) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleChange = (
    index,
    field,
    value
  ) => {
    setResumeData((prev) => {
      const updatedEducation = [
        ...prev.education,
      ];

      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value,
      };

      return {
        ...prev,
        education: updatedEducation,
      };
    });
  };

  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl md:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">
            Academics
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950 md:text-2xl">
            Education
          </h2>
        </div>

        <Button
          type="button"
          onClick={addEducation}
          className="bg-slate-950 text-white hover:bg-slate-800"
        >
          Add Education
        </Button>
      </div>

      <div className="space-y-6">
        {data.map((edu, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-100 bg-white/75 p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">
                Education #{index + 1}
              </h3>

              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  removeEducation(index)
                }
                className="bg-red-50 text-red-600 hover:bg-red-100"
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 text-slate-700">
                  School / College / University
                </Label>

                <Input
                  placeholder="University of Karachi"
                  value={edu.institute}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "institute",
                      e.target.value
                    )
                  }
                  className="h-11 border-slate-200 bg-white"
                />
              </div>

              <div>
                <Label className="mb-2 text-slate-700">
                  Degree / Program
                </Label>

                <Input
                  placeholder="BS Computer Science"
                  value={edu.degree}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "degree",
                      e.target.value
                    )
                  }
                  className="h-11 border-slate-200 bg-white"
                />
              </div>

              <div>
                <Label className="mb-2 text-slate-700">Start Year</Label>

                <Input
                  placeholder="2022"
                  value={edu.startYear}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "startYear",
                      e.target.value
                    )
                  }
                  className="h-11 border-slate-200 bg-white"
                />
              </div>

              <div>
                <Label className="mb-2 text-slate-700">End Year</Label>

                <Input
                  placeholder="2026"
                  value={edu.endYear}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "endYear",
                      e.target.value
                    )
                  }
                  className="h-11 border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
