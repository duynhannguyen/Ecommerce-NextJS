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
import { Input } from "../ui/input";
import AuthCard from "./auth-card";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { newPasswordSchema } from "@/types/new-password-schema";
import newPassword from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const NewPasswordForm = () => {
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(newPassword, {
    onSuccess(data) {
      if (data.data?.error) {
        setError(data.data.error);
      }
      if (data.data?.success) {
        setSuccess(data.data.success);
        router.push("/auth/login");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    execute({
      password: values.password,
      token,
    });
  };

  return (
    <AuthCard
      cardTitle="Enter a new password"
      BackButtonHref="/auth/login"
      BackButtonLabel="Back to login"
      showSocials={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
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
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
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
            Reset Password
          </Button>
        </form>
      </Form>
    </AuthCard>
  );
};

export default NewPasswordForm;
