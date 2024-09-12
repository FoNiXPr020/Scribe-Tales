"use client";

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, ChromeIcon } from "@/components/ui/Icons";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaLogin } from "@/lib/schema";
import { Loader2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import MotionRotate from "@/components/motions/MotionRotate";

export default function Login() {
  const { login: LoginSubmit, GoogleLogin } = useAuth();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm({
    defaultValues: {
      email: "FoNiX@example.com",
      password: "123123123",
    },
    resolver: zodResolver(schemaLogin),
  });

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await LoginSubmit(data);

      const { from } = location.state || {
        from: { pathname: `/${response.user.username}` },
      };
      navigate(from.pathname, { replace: true });

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
    <main className="container mx-auto max-w-md py-12 px-4 md:py-24">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign in</h1>
          <p className="text-muted-foreground">
            Enter your email and password to access your account.
          </p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className={`text-sm text-foreground hover:underline`}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                name="password"
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

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sign In
              </div>
            ) : (
              "Sign In"
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
          className="mt-2 w-full"
          onClick={() => GoogleAuth()}
        >
          <ChromeIcon className="mr-2 h-4 w-4" />
          Sign In with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary-foreground hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
