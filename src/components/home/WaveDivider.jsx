import { motion, useReducedMotion } from "framer-motion";

/**
 * A continuously-flowing wave divider between sections — the core "flow of
 * water" motif. The path is drawn twice back-to-back in a 2x-wide viewBox and
 * translated by exactly one copy-width on a linear loop, so the motion never
 * jumps or resets: it reads as water endlessly moving in one direction.
 */
export default function WaveDivider({
  position = "bottom", // "bottom" = sits at the end of a section, "top" = start of a section (flipped)
  fillClassName = "fill-white dark:fill-ink-900",
  secondaryFillClassName,
  duration = 22,
  className = "",
}) {
  const reduce = useReducedMotion();
  const flip = position === "top";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${flip ? "top-0" : "bottom-0"} overflow-hidden leading-none ${className}`}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      {secondaryFillClassName && (
        <motion.svg
          viewBox="0 0 2880 120"
          className="absolute inset-0 w-[200%] h-16 md:h-24 opacity-50"
          preserveAspectRatio="none"
          animate={reduce ? undefined : { x: [0, -1440] }}
          transition={{ duration: duration * 1.6, repeat: Infinity, ease: "linear" }}
        >
          <path
            className={secondaryFillClassName}
            d="M0,72 C240,20 480,124 720,72 C960,20 1200,124 1440,72
               C1680,20 1920,124 2160,72 C2400,20 2640,124 2880,72
               L2880,120 L0,120 Z"
          />
        </motion.svg>
      )}
      <motion.svg
        viewBox="0 0 2880 120"
        className="relative w-[200%] h-16 md:h-24"
        preserveAspectRatio="none"
        animate={reduce ? undefined : { x: [0, -1440] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        <path
          className={fillClassName}
          d="M0,64 C240,120 480,0 720,64 C960,128 1200,16 1440,64
             C1680,120 1920,0 2160,64 C2400,128 2640,16 2880,64
             L2880,120 L0,120 Z"
        />
      </motion.svg>
    </div>
  );
}
