import { z } from "zod";

export const schemaLogin = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email address." })
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(1, { message: "Please enter your password." })
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const schemaRegister = z
  .object({
    first_name: z
      .string()
      .min(1, { message: "Please enter your first name." })
      .max(50, { message: "First name cannot exceed 50 characters." })
      .regex(/^[a-zA-Z]+$/u, {
        message: "First name can only contain letters.",
      }),
    last_name: z
      .string()
      .min(1, { message: "Please enter your last name." })
      .max(50, { message: "Last name cannot exceed 50 characters." })
      .regex(/^[a-zA-Z]+$/u, {
        message: "Last name can only contain letters.",
      }),
    email: z
      .string()
      .min(1, { message: "Please enter your email address." })
      .email({ message: "Please enter a valid email address." }),
    username: z
      .string()
      .min(1, { message: "Please enter your username." })
      .max(22, { message: "Username cannot exceed 22 characters." })
      .regex(/^[a-zA-Z0-9]+$/u, {
        message: "Username can only contain letters and numbers.",
      }),
    region: z
      .string()
      .min(1, { message: "Please enter your region." })
      .max(50, { message: "Region cannot exceed 50 characters." })
      .regex(/^[a-zA-Z]+$/u, { message: "Region can only contain letters." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z.string().min(8, {
      message: "Password confirmation must be at least 8 characters.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

export const schemaUpdate = z.object({
  first_name: z
    .string()
    .min(2, { message: "Please enter your first name." })
    .max(50, { message: "First name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z]+$/u, { message: "First name can only contain letters." }),
  last_name: z
    .string()
    .min(2, { message: "Please enter your last name." })
    .max(50, { message: "Last name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z]+$/u, { message: "Last name can only contain letters." }),
  username: z
    .string()
    .min(1, { message: "Please enter your username." })
    .max(22, { message: "Username cannot exceed 22 characters." })
    .regex(/^[a-zA-Z0-9]+$/u, {
      message: "Username can only contain letters and numbers.",
    }),
  region: z
    .string()
    .min(1, { message: "Please enter your region." })
    .max(50, { message: "Region cannot exceed 50 characters." })
    .regex(/^[a-zA-Z]+$/u, { message: "Region can only contain letters." }),
});

export const schemaPassword = z
  .object({
    current_password: z
      .string()
      .min(1, { message: "Please enter your current password." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    password_confirmation: z
      .string()
      .min(8, {
        message: "Password confirmation must be at least 8 characters.",
      }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "New Password and confirmation do not match.",
    path: ["password_confirmation"],
  });
