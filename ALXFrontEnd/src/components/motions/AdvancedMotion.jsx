import React from 'react';
import { motion } from 'framer-motion';

const animationVariants = {
  top: {
    initial: { opacity: 0, y: -200 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 200 }
  },
  bottom: {
    initial: { opacity: 0, y: 200 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -200 }
  },
  left: {
    initial: { opacity: 0, x: -200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 }
  },
  right: {
    initial: { opacity: 0, x: 200 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -200 }
  },
  rotate: {
    initial: { opacity: 0, rotate: -30 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 30 }
  }
};

const AdvancedMotion = ({ 
  direction = 'top', 
  children, 
  className = "",
  transition = {
    type: "spring",
    stiffness: 120,
    damping: 25,
    duration: 0.8,
    ease: "easeOut",
    mass: 1
  },
  ...motionProps // Spread operator to accept additional motion props
}) => {
  const variant = animationVariants[direction] || animationVariants.top;

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      transition={transition}
      exit={variant.exit}
      className={className}
      {...motionProps} // Apply additional motion props
    >
      {children}
    </motion.div>
  );
};

export default AdvancedMotion;
