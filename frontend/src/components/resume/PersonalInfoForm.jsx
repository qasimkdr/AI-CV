import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalInfoForm({
  data,
  setResumeData,
}) {
  const handleChange = (e) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [e.target.name]: e.target.value,
      },
    }));
  };

  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-xl md:p-6">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">
          Identity
        </p>
        <h2 className="mt-2 text-xl font-black text-slate-950 md:text-2xl">
          Personal Information
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label className="mb-2 text-slate-700">Full Name</Label>
          <Input
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            placeholder="Muhammad Qasim"
            className="h-11 border-slate-200 bg-white"
          />
        </div>

        <div>
          <Label className="mb-2 text-slate-700">Email</Label>
          <Input
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            placeholder="qasim@gmail.com"
            className="h-11 border-slate-200 bg-white"
          />
        </div>

        <div>
          <Label className="mb-2 text-slate-700">Phone</Label>
          <Input
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            className="h-11 border-slate-200 bg-white"
          />
        </div>

        <div>
          <Label className="mb-2 text-slate-700">Address</Label>
          <Input
            name="address"
            value={data.address}
            onChange={handleChange}
            placeholder="Karachi, Pakistan"
            className="h-11 border-slate-200 bg-white"
          />
        </div>

        <div>
          <Label className="mb-2 text-slate-700">LinkedIn</Label>
          <Input
            name="linkedin"
            value={data.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/in/qasim"
            className="h-11 border-slate-200 bg-white"
          />
        </div>

        <div>
          <Label className="mb-2 text-slate-700">Github</Label>
          <Input
            name="github"
            value={data.github}
            onChange={handleChange}
            placeholder="github.com/qasim"
            className="h-11 border-slate-200 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
