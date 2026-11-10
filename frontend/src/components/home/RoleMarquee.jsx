import Counter from "../motion/Counter";
import Reveal from "../motion/Reveal";

const roles = [
  "Software Engineer", "Product Designer", "Marketing Manager", "Data Analyst",
  "Registered Nurse", "Teacher", "Accountant", "Sales Lead", "Graduate Student",
  "Project Manager", "UX Researcher", "DevOps Engineer", "HR Specialist", "Content Writer",
];

const stats = [
  { to: 5, suffix: "", label: "Pro templates" },
  { to: 2, suffix: "", label: "Export formats" },
  { to: 1, suffix: "-click", label: "AI enhancement" },
  { to: 100, suffix: "%", label: "Free to start" },
];

export default function RoleMarquee() {
  return (
    <section aria-label="Who AI CV is for" className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium text-ink-soft">
          Loved by job seekers in every field
        </p>
        <div className="mask-fade-x mt-5 overflow-hidden">
          <div className="animate-marquee flex w-max gap-3 hover:[animation-play-state:paused]">
            {[...roles, ...roles].map((r, i) => (
              <span
                key={i}
                aria-hidden={i >= roles.length}
                className="glass rounded-full px-5 py-2.5 text-sm font-medium text-ink"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <Reveal className="glass mt-10 grid grid-cols-2 gap-6 rounded-3xl p-6 sm:p-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <Counter to={s.to} suffix={s.suffix} className="font-display text-4xl font-extrabold text-gradient sm:text-5xl" />
              <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
