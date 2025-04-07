"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifySchema } from "@/lib/zodSchema";
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
import { useMutation } from "@apollo/client";
import { GQLMutations } from "@/graphql";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      email: "",
      verifyCode: "",
    },
  });

  const [verifyUser, { loading, error }] = useMutation(
    GQLMutations.VERIFY_USER
  );

  async function onSubmit(values: z.infer<typeof verifySchema>) {
    const { email, verifyCode } = values;
    const user = await verifyUser({ variables: { email, verifyCode } });
    console.log("verified user: ", user);
    if (user) router.replace("/signin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF6EC] px-4">
      <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center text-[#26170b]">
          Welcome to <span className="text-[#D62828]">ReadCycle</span>
        </h2>
        <p className="text-center text-[#26170b] mb-6 text-sm">
          Confirm your account and start exchanging books effortlessly!
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
                      placeholder="Enter your registered email"
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
              name="verifyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#26170b]">
                    Verification Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your 6-digit code"
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
              className="w-full bg-[#362110] hover:bg-[#301e10] text-white font-medium py-2 rounded-lg transition cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
