import { useTheme } from "../ThemeContext";
import { CopySlashIcon } from "../components/ui/Icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollToTopButton from "@/utils/ScrollToTopButton";

const footerNavigation = [
  { name: "Privacy", href: "#" },
  { name: "Terms", href: "#" },
  { name: "API", href: "/docs" },
];

const Footer = () => {
  const { theme } = useTheme();
  return (
    <>
      <ScrollToTopButton/>
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
        exit={{ opacity: 0 }}
        className={`py-6 ${
          theme === "light" ? "bg-background" : "bg-muted/50"
        }`}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <CopySlashIcon className="h-6 w-6" />
              <span className="text-lg font-bold">Scribe Tales</span>
            </div>
            <nav className="flex gap-4">
              {footerNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm hover:underline hover:underline-offset-4"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <p className="text-sm">
              &copy; 2024 Scribe Tales. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </>
  );
};

export default Footer;
