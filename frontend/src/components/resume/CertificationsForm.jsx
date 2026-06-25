import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CertificationsForm({
  data,
  setResumeData,
}) {
  const addCertification =
    () => {
      setResumeData(
        (prev) => ({
          ...prev,
          certifications: [
            ...prev.certifications,
            "",
          ],
        })
      );
    };

  const removeCertification =
    (index) => {
      setResumeData(
        (prev) => ({
          ...prev,
          certifications:
            prev.certifications.filter(
              (_, i) =>
                i !== index
            ),
        })
      );
    };

  const updateCertification =
    (index, value) => {
      setResumeData(
        (prev) => {
          const updated =
            [
              ...prev.certifications,
            ];

          updated[index] =
            value;

          return {
            ...prev,
            certifications:
              updated,
          };
        }
      );
    };

  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl md:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">
            Credentials
          </p>
          <h2 className="mt-2 text-xl font-black text-slate-950 md:text-2xl">
            Certifications
          </h2>
        </div>

        <Button
          type="button"
          onClick={
            addCertification
          }
          className="bg-slate-950 text-white hover:bg-slate-800"
        >
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {data.map(
          (
            certification,
            index
          ) => (
            <div
              key={index}
              className="flex flex-col gap-3 md:flex-row"
            >
              <Input
                value={
                  certification
                }
                className="h-11 border-slate-200 bg-white"
                onChange={(
                  e
                ) =>
                  updateCertification(
                    index,
                    e.target.value
                  )
                }
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() =>
                  removeCertification(
                    index
                  )
                }
                className="bg-red-50 text-red-600 hover:bg-red-100"
              >
                Remove
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
