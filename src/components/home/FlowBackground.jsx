import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient background layer for the hero: glowing drifting shapes, flowing
 * current lines, and a stream of rising bubbles — meant to be clearly
 * noticeable, not just a subtle texture. Transform/opacity only, disabled
 * for prefers-reduced-motion.
 */
export default function FlowBackground({ className = "", showLines = true, showBubbles = true }) {
  const reduce = useReducedMotion();

  const blobs = [
    { size: 460, top: "-15%", left: "-8%", color: "bg-brand-300/60 dark:bg-brand-400/45", dur: 16, dx: [0, 60, -20, 0], dy: [0, -40, 30, 0] },
    { size: 360, top: "10%", left: "70%", color: "bg-brand-200/60 dark:bg-brand-300/40", dur: 20, dx: [0, -50, 30, 0], dy: [0, 45, -30, 0] },
    { size: 300, top: "55%", left: "8%", color: "bg-brand-400/50 dark:bg-brand-300/35", dur: 14, dx: [0, 40, -35, 0], dy: [0, -30, 25, 0] },
  ];

  const bubbles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${(i * 6.7) % 100}%`,
    size: 8 + ((i * 5) % 18),
    dur: 7 + (i % 6) * 1.6,
    delay: i * 0.5,
    drift: ((i % 3) - 1) * 40,
  }));

  return (
    <div aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-2xl ${b.color}`}
          style={{ width: b.size, height: b.size, top: b.top, left: b.left }}
          animate={reduce ? undefined : { x: b.dx, y: b.dy, scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}

      {/* Flowing current lines — high-contrast strokes, guaranteed visible motion */}
      {showLines && !reduce && (
        <motion.svg
          viewBox="0 0 1440 400"
          className="absolute inset-0 w-[200%] h-full opacity-70 dark:opacity-60"
          preserveAspectRatio="none"
          animate={{ x: [0, -720] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          <path
            d="M0,120 C120,80 240,160 360,120 C480,80 600,160 720,120 C840,80 960,160 1080,120 C1200,80 1320,160 1440,120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-brand-400/70 dark:text-brand-300/60"
          />
          <path
            d="M0,240 C120,280 240,200 360,240 C480,280 600,200 720,240 C840,280 960,200 1080,240 C1200,280 1320,200 1440,240"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-brand-500/50 dark:text-brand-200/40"
          />
        </motion.svg>
      )}

      {showBubbles && !reduce && bubbles.map((b) => (
        <motion.span
          key={b.id}
          className="absolute rounded-full bg-brand-300 dark:bg-brand-200 shadow-[0_0_14px_3px] shadow-brand-300/70 dark:shadow-brand-200/60"
          style={{ left: b.left, width: b.size, height: b.size, bottom: -40 }}
          animate={{
            y: [0, -560],
            x: [0, b.drift, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: b.dur,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.15, 0.8, 1],
          }}
        />
      ))}
    </div>
  );
}
