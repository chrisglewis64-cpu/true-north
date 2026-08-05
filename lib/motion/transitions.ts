export const needleTransition = {
  duration: 0.8,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const compassTextTransition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const centerDotBreathingTransition = {
  duration: 7,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export const modalTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const modalContentTransition = {
  duration: 0.35,
  delay: 0.12,
  ease: [0.22, 1, 0.36, 1] as const,
};
