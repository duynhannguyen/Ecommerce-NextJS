"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/types/login-schema";
import * as z from "zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { emailSignIn } from "@/server/actions/email-signin";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormError from "./form-error";
import FormSuccess from "./form-success";
const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
      }
      if (data.data?.twoFactor) {
        setShowTwoFactor(true);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Welcome back"
      BackButtonHref="/auth/register"
      BackButtonLabel="Create new account"
      showSocials={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {showTwoFactor && (
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      We have sent you a two factor code to your email
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        disabled={status === "executing"}
                        {...field}
                        maxLength={6}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="a@gmail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button size={"sm"} variant={"link"} asChild>
              <Link href={"/auth/reset"}> Forgot your password </Link>
            </Button>
          </div>
          <Button
            type="submit"
            className={cn(
              "w-full",
              status === "executing" ? "animate-pulse" : ""
            )}
          >
            {showTwoFactor ? "Verify" : "Sign In"}
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginForm;
