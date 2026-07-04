import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// Single element fade/slide-up on scroll into view.
export function Reveal({ children, className, delay = 0, id }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      id={id}
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Wrap a grid/list with RevealGroup, and each child with RevealItem —
// children rise into place staggered, like surfacing one after another.
export function RevealGroup({ children, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? undefined : containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, id }) {
  const reduce = useReducedMotion();
  return (
    <motion.div id={id} className={className} variants={reduce ? undefined : itemVariants}>
      {children}
    </motion.div>
  );
}
