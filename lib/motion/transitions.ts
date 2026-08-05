export const compassTransition = {
  type: "spring" as const,
  stiffness: 42,
  damping: 18,
  mass: 1.1,
};

export const modalTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};
