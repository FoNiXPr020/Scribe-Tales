import React, { useState } from "react";
import { useTheme } from "../ThemeContext";
import { Link } from "react-router-dom";
import {
  MoonIcon,
  SunIcon,
  MenuIcon,
  FeatherIcon,
} from "@/components/ui/Icons";
import { Toggle } from "@/components/ui/toggle";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { SignBtn } from "@/components/layouts/SignBtn";
import { ProfileAvatar } from "@/components/layouts/ProfileAvatar";
import { NotificationsDropdown } from "@/components/layouts/NotificationsDropdown";
import MotionRotate from "@/components/motions/MotionRotate";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Stories", href: "/explore" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) return <></>;

  const handleLinkClick = () => {
    setIsOpen(false);
  };
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
      className={`sticky top-0 z-40 w-full border-b px-4 py-3 backdrop-blur-2xl ${
        theme === "light" ? "bg-background/80" : "bg-muted/80"
      }`}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-1 sm:px-4 lg:px-12">
        <Link to={"/"} className="flex items-center gap-2">
          <FeatherIcon className="h-6 w-6" />
          <span className="text-lg font-bold">Scribe Tales</span>
        </Link>
        <nav className="hidden space-x-4 sm:hidden lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`rounded-md px-3 py-2 transition-colors hover:underline hover:underline-offset-4 ${
                theme === "light" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">

          
          {isAuthenticated && <NotificationsDropdown />}

          <Toggle
            variant="outline"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <MotionRotate keyVar="SunIcon" rotate={-90} exitRotate={90}>
                <SunIcon className="h-4 w-4" />
              </MotionRotate>
            ) : (
              <MotionRotate keyVar="MoonIcon" rotate={90} exitRotate={-90}>
                <MoonIcon className="h-4 w-4" />
              </MotionRotate>
            )}
          </Toggle>

          {isAuthenticated ? <ProfileAvatar /> : <SignBtn />}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-muted"
              >
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-4">
              <SheetHeader>
                <SheetTitle>
                  <Link className="flex items-center gap-2">
                    <FeatherIcon className="h-6 w-6" />
                    <span className="font-bold">Scribe Tales</span>
                  </Link>
                </SheetTitle>
                <SheetDescription />
              </SheetHeader>
              <div className="flex items-center gap-2 mb-4"></div>
              <nav className="grid gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    onClick={handleLinkClick}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
