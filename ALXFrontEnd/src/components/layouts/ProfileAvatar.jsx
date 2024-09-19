"use client";

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, CircleGauge, FeatherIcon, User, Loader2 } from "lucide-react";

export const ProfileAvatar = () => {
  const { profileId, logout, user } = useAuth();

  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const navigateDash = [
    [
      `/${profileId.toLowerCase()}`,
      "Dashboard",
      <CircleGauge className="h-4 w-4" />,
    ],
    ["/my-stories", "My Stories", <FeatherIcon className="h-4 w-4" />],
    ["/profile", "My Profile", <User className="h-4 w-4" />],
  ];

  const handleLogout = async (e) => {
    // Prevent the menu from closing
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src={user?.profile_photo || "/assets/placeholder-user.jpg"} />
            <AvatarFallback>ST</AvatarFallback>
            <span className="sr-only">Toggle user menu</span>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36 rounded-xl">
          <DropdownMenuLabel>Account </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navigateDash.map(([to, text, icon]) => (
            <Link key={to} to={to}>
              <DropdownMenuItem className="cursor-pointer gap-2">
                {icon}
                {text}
              </DropdownMenuItem>
            </Link>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer gap-2"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 text-red-500" />
            )}
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
