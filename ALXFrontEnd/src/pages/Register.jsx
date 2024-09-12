"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, ChromeIcon } from "@/components/ui/Icons";
import { motion } from "framer-motion";
import { LINK_LOGIN } from "@/routes/routes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaRegister } from "@/lib/schema";
import MotionRotate from "@/components/motions/MotionRotate";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const { register: authRegister, GoogleLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      first_name: "Lora",
      last_name: "Parker",
      email: "LoraKingDom1@gmail.com",
      username: "LoraKingDom1",
      region: "Spain",
      password: "123123123",
      password_confirmation: "123123123",
    },
    resolver: zodResolver(schemaRegister),
  });

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await authRegister(data);
      navigate(`/${response.user.username}`);
      reset();
    } catch (formErrors) {
      for (const key in formErrors) {
        setError(key, formErrors[key]);
      }
    }
  });

  const handleSuccess = async (response) => {
    setIsLoadingGoogle(true);
    try {
      console.log(response);
      const { access_token } = response;
      console.log(access_token);
      const res = await GoogleLogin({
        token: access_token,
      });

      console.log(res);

      // Assuming the backend returns the username after successful login
      const { username } = res.user;
      console.log(username);

      // Redirect to the user's profile page
      setIsLoadingGoogle(false);
      navigate(`/${username}`);
      //alert("Login successful");
    } catch (error) {
      console.log(error);
      console.error("Login failed:", error);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleFailure = (error) => {
    console.error("Login failed:", error);
  };

  const GoogleAuth = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleFailure,
  });

  if (isLoadingGoogle) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="rounded-lg p-4">
          <Loader2 className="mx-auto h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto max-w-md py-12 px-4 md:py-16">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">
            Welcome to join our community! You can explore and connect with
            other users.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  {...register("first_name")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  {...register("last_name")}
                />
              </div>
            </div>

            {(errors.first_name || errors.last_name) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  {errors.first_name && (
                    <p className="text-sm text-orange-800">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  {errors.last_name && (
                    <p className="text-sm text-orange-800">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-orange-800">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="JohnDoe40"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-sm text-orange-800">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              placeholder="Your Region"
              {...register("region")}
            />
            {errors.region && (
              <p className="text-sm text-orange-800">{errors.region.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
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
            <div className="flex items-center justify-between">
              <Label htmlFor="confirmPassword">Password Confirmation</Label>
            </div>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Password Confirmation"
                {...register("password_confirmation")}
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-sm text-orange-800">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sign Up
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="flex items-center">
          <hr className="flex-1" />
          <span className="mx-4 text-muted-foreground">OR</span>
          <hr className="flex-1" />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => GoogleAuth()}
        >
          <ChromeIcon className="mr-2 h-4 w-4" />
          Sign In with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to={LINK_LOGIN}
            className="font-medium text-primary-foreground hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
