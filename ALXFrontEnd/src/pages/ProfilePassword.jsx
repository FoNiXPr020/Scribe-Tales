"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/ThemeContext";
import { schemaPassword } from "@/lib/schema";
import { motion } from "framer-motion";
import MotionRotate from "@/components/motions/MotionRotate";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons";
import { UpdateProfilePassword } from "@/services/authApi";
import { toast } from "react-toastify";

const ProfilePassword = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(schemaPassword),
  });

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      const response = await UpdateProfilePassword(data);

      if (response.status === 200) {
        reset();
        toast.success("Password updated successfully");
      }
    } catch (formErrors) {
      if (formErrors instanceof Error) {
        console.error(formErrors.message);
        // Optionally, you can display a global error message
      } else {
        // Set the backend errors in the form
        for (const key in formErrors) {
          setError(key, formErrors[key]);
        }
      }
    }
  });

  return (
    <>
      <div
        className={`flex-1 shadow-sm p-6 rounded-xl gap-4 ${
          theme === "light" ? "bg-background" : "bg-muted"
        }`}
      >
        <h2 className="text-xl font-semibold text-foreground dark:text-foreground-dark mb-4">
          Update Password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            
          <div className="grid gap-2">
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              {...register("current_password")}
              id="current_password"
              name="current_password"
              type="password"
              placeholder="Enter your current password"
            />
            {errors.current_password && (
              <p className="text-sm text-orange-800">
                {errors.current_password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="newPassword">New Password</Label>
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
              />
              <motion.a
                className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2"
                onClick={handleShowPassword}
              >
                <MotionRotate
                  keyVar={showPassword ? "EyeOffIcon" : "EyeIcon"}
                  rotate={showPassword ? 100 : -100}
                  exitRotate={showPassword ? -100 : 100}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </MotionRotate>
                <span className="sr-only">Toggle password visibility</span>
              </motion.a>
            </div>

            {errors.password && (
              <p className="text-sm text-orange-800">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              {...register("password_confirmation")}
              id="password_confirmation"
              name="password_confirmation"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your new password"
            />
            {errors.password_confirmation && (
              <p className="text-sm text-orange-800">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/reset-password"
              className="text-muted-foreground transition-colors hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button className="rounded-xl px-4 py-2 flex items-center justify-center">
            Update Password
          </Button>
        </form>
      </div>
    </>
  );
};

export default ProfilePassword;
