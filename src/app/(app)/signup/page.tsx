"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/lib/zodSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { GQLMutations } from "@/graphql";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });
  const [createUser, { loading, error }] = useMutation(
    GQLMutations.CREATE_USER
  );

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const { firstName, lastName, email, password } = values;
    const user = await createUser({
      variables: { firstName, lastName, email, password },
    });
    if (user) router.replace("/verify-user");
    console.log(user);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC] px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center text-[#26170b]">
          Join <span className="text-[#D62828]">ReadCycle</span>
        </h2>
        <p className="text-center text-[#26170b] mb-6 text-sm">
          Give Books a Second Life – Sign up and start exchanging!
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26170b]">First Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      className="bg-transparent text-[#26170b] placeholder-[#26170b] focus:outline-none focus:ring-0 focus:shadow-md transition-shadow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26170b]">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      className="bg-transparent text-[#26170b] placeholder-[#26170b] focus:outline-none focus:ring-0 focus:shadow-md transition-shadow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26170b]">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe@example.com"
                      {...field}
                      className="bg-transparent text-[#26170b] placeholder-[#26170b] focus:outline-none focus:ring-0 focus:shadow-md transition-shadow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26170b]">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="bg-transparent text-[#26170b] placeholder-[#26170b] focus:outline-none focus:ring-0 focus:shadow-md transition-shadow"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#362110] hover:bg-[#301e10] text-white font-medium py-2 rounded-lg transition cursor-pointer "
            >
              {loading ? (
                <div className="flex items-center gap-1 ">
                  <Loader2 className="animate-spin" />
                  Signing up...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-[#26170b]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#D62828] font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
