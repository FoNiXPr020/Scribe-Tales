"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { SendForgotPasswordLink } from "@/lib/password";
import { toast } from "react-toastify";
import Page from "@/Page";

const schemaForgot = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email address." })
    .email({ message: "Please enter a valid email address." }),
});

export default function ForgotPassword() {
  const [status, setStatus] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: "FoNiX@example.com",
    },
    resolver: zodResolver(schemaForgot),
  });

  const onSubmit = handleSubmit(async (data) => {
    setStatus("");
    try {
      const response = await SendForgotPasswordLink(data);
      setStatus(response.status);
      toast.success("Password reset link sent to your email");
    } catch (formErrors) {
      if (formErrors instanceof Error) {
        console.error(formErrors.message);
      } else {
        for (const key in formErrors) {
          console.error(key, formErrors[key]);
          setError(key, formErrors[key]);
        }
      }
    }
  });

  return (
    <>
      <Page title="Forgot Password" />
      <main className="container mx-auto max-w-md py-12 px-4 md:py-24">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground">
              Enter your email and we will send you a password reset link
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
                <p className="text-sm text-orange-800">
                  {errors.email.message}
                </p>
              )}
              {status && <p className="text-sm text-green-800">{status}</p>}
            </div>
            <Button disabled={isSubmitting} type="submit" className="w-full">
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            You remembered your password?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-foreground hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
