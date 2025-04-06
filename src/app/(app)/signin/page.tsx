"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/zodSchema";
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
import { useLazyQuery, useQuery } from "@apollo/client";
import { GQLQueries } from "@/graphql";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const [fetchToken, { loading, error }] = useLazyQuery(
    GQLQueries.GET_USER_TOKEN
  );

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    const response = await fetchToken({ variables: values });
    if (response.error) setErrorMessage(response.error.message);
    else router.replace('/home')
    console.log("Response: ", response);
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

            {errorMessage ? (
              <p className="text-red-600 mb-2">{errorMessage}</p>
            ) : (
              <></>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#362110] hover:bg-[#301e10] text-white font-medium py-2 rounded-lg transition cursor-pointer "
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-[#26170b]">
            New to ReadCycle?{" "}
            <Link
              href="/signup"
              className="text-[#D62828] font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
