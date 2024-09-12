import React from 'react';

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/ThemeContext";

export const SignBtn = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const linkPath = isLoginPage ? "/register" : "/login";
  const buttonText = isLoginPage ? "Sign Up" : "Sign In";

  return (
    <Link to={linkPath}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
          theme === "light"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
        >
          {buttonText}
        </motion.div>
      </motion.button>
    </Link>
  );
};