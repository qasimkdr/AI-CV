import { motion, useReducedMotion } from "framer-motion";

/** Fades + lifts children into view once. */
export default function Reveal({
  children,
  delay = 0,
  y = 28,
  as = "div",
  className = "",
  ...rest
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;

  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}
