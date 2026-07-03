import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A button that spawns an expanding, fading ring from the click point —
 * a literal water-ripple, reinforcing the "flow of water" motif on the
 * app's primary calls to action.
 */
export default function RippleButton({ as: As = "button", className = "", onClick, children, ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, size }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    onClick?.(e);
  }, [onClick]);

  return (
    <As
      onClick={handleClick}
      className={`relative overflow-hidden isolate ${className}`}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full bg-white/40 pointer-events-none"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size, marginLeft: -r.size / 2, marginTop: -r.size / 2 }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </As>
  );
}
