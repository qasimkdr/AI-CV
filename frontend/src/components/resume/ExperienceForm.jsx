import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExperienceForm({
  data,
  setResumeData,
}) {
  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter(
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
      const updated = [
        ...prev.experience,
      ];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        experience: updated,
      };
    });
  };

  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl md:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">
            Work history
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950 md:text-2xl">
            Experience
          </h2>
        </div>

        <Button
          type="button"
          onClick={addExperience}
          className="bg-slate-950 text-white hover:bg-slate-800"
        >
          Add Experience
        </Button>
      </div>

      <div className="space-y-6">
        {data.map((exp, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-100 bg-white/75 p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">
                Experience #{index + 1}
              </h3>

              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  removeExperience(index)
                }
                className="bg-red-50 text-red-600 hover:bg-red-100"
              >
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 text-slate-700">Company</Label>

                <Input
                  value={exp.company}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "company",
                      e.target.value
                    )
                  }
                  className="h-11 border-slate-200 bg-white"
                />
              </div>

              <div>
                <Label className="mb-2 text-slate-700">Position</Label>

                <Input
                  value={exp.position}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "position",
                      e.target.value
                    )
                  }
                  className="h-11 border-slate-200 bg-white"
                />
              </div>

              <div>
                <Label className="mb-2 text-slate-700">Start Date</Label>

                <Input
                  value={exp.startDate}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "startDate",
                      e.target.value
                    )
                  }
                  className="h-11 border-slate-200 bg-white"
                />
              </div>

              <div>
                <Label className="mb-2 text-slate-700">End Date</Label>

                <Input
                  value={exp.endDate}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "endDate",
                      e.target.value
                    )
                  }
                  className="h-11 border-slate-200 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="mb-2 text-slate-700">
                  Description
                </Label>

                <textarea
                  rows={4}
                  value={exp.description}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
