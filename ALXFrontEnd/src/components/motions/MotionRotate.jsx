import { motion } from "framer-motion";

const MotionRotate = ({ keyVar, rotate, exitRotate, children, ...props }) => {
  return (
    <motion.div
      key={keyVar}
      initial={{ opacity: 0, rotate }}
      animate={{
        opacity: 1,
        rotate: 0,
        transition: { duration: 0.5 },
      }}
      exit={{ opacity: 0, rotate: exitRotate }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default MotionRotate;
