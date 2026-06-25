import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProjectsForm({
  data,
  setResumeData,
}) {
  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: "",
        },
      ],
    }));
  };

  const removeProject = (
    index
  ) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateProject = (
    index,
    field,
    value
  ) => {
    setResumeData((prev) => {
      const updated = [
        ...prev.projects,
      ];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        projects: updated,
      };
    });
  };

  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl md:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">
            Proof of work
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950 md:text-2xl">
            Projects
          </h2>
        </div>

        <Button
          type="button"
          onClick={addProject}
          className="bg-slate-950 text-white hover:bg-slate-800"
        >
          Add Project
        </Button>
      </div>

      <div className="space-y-6">
        {data.map(
          (project, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-100 bg-white/75 p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                  Project #
                  {index + 1}
                </h3>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    removeProject(
                      index
                    )
                  }
                  className="bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-2 text-slate-700">
                    Project Title
                  </Label>

                  <Input
                    value={
                      project.title
                    }
                    onChange={(e) =>
                      updateProject(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    className="h-11 border-slate-200 bg-white"
                  />
                </div>

                <div>
                  <Label className="mb-2 text-slate-700">
                    Description
                  </Label>

                  <textarea
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                    value={
                      project.description
                    }
                    onChange={(e) =>
                      updateProject(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
