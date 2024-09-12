import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import Footer from "./Footer";
import ScrollToTop from "@/utils/ScrollToTop";
import CancelSpeetch from "@/utils/CancelSpeetch.jsx";

const Layout = () => {
  const { theme } = useTheme();
  CancelSpeetch();

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors ${
        theme === "light"
          ? "bg-muted text-foreground"
          : "bg-background text-muted-foreground"
      }`}
    >
      <Navbar />
      <div className="flex-grow">
          <Outlet />
      </div>
      <div className="flex-shrink-0">
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default Layout;
