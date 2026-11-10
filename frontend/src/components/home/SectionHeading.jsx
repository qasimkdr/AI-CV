import Reveal from "../motion/Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center", icon: Icon }) {
  const center = align === "center";
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <span className="eyebrow">
          {Icon && <Icon size={13} />}
          {eyebrow}
        </span>
      )}
      <h2 className="mt-5 text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{subtitle}</p>}
    </Reveal>
  );
}
