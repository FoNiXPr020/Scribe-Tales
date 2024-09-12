import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons";
import MotionRotate from "@/components/motions/MotionRotate";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordReset } from "@/lib/password";
import { toast } from "react-toastify";

const schemaPassword = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z.string().min(8, {
      message: "Password confirmation must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "New Password and confirmation do not match.",
    path: ["password_confirmation"],
  });

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({ resolver: zodResolver(schemaPassword) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = { ...data, token, email };
      await PasswordReset(payload);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (formErrors) {
      console.error(formErrors);
      if (formErrors instanceof Error) {
        console.error(formErrors.message);
      } else {
        for (const key in formErrors) {
          setError(key, formErrors[key]);
        }
      }
    }
  });

  return (
    <main className="container mx-auto max-w-md py-12 px-4 md:py-16">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your new password below. Please make sure it is strong enough.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">New Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
              />
              <a
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
              </a>
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

          {errors.email && (
            <p className="text-sm text-orange-800">{errors.email.message}</p>
          )}

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Reset Password
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Reset your password and please remember it. We won't store it
          anywhere.{" "}
        </p>
      </div>
    </main>
  );
};

export default ResetPassword;
