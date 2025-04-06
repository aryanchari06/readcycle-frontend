"use client";

import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  password: z.string().min(6, { message: "Min 6 characters required" }),
});

export const loginSchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  password: z.string(),
});

export const verifySchema = z.object({
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
  verifyCode: z.string().length(6, {message: "Verify Code must be exactly 6 digits"})
})

export const bookRequestSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  description: z.string().max(300, {
    message: "Description must be under 300 characters.",
  }),
  price: z.number().min(10, {
    message: "The minimum price allowed is ₹10. Please enter a valid amount.",
  }),
});

