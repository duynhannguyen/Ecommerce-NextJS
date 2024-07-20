"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CldUploadWidget } from "next-cloudinary";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SettingSchema } from "@/types/settings-shema";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { settings } from "@/server/actions/settings";

type SettingsForm = {
  session: Session;
};

export default function SettingsCard(session: SettingsForm) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  // console.log("avatarUploading", avatarUploading);
  // console.log("session", session.session);
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.session.user.name || undefined,
      email: session.session.user.email || undefined,
      image: session.session.user.image || undefined,
      isTwoFactorEnabled: session.session.user.isTwoFactorEnabled || undefined,
    },
  });
  const { execute, status } = useAction(settings, {
    onSuccess: (data) => {
      if (data.data?.success) setSuccess(data.data.success);
      if (data.data?.error) setError(data.data.error);
    },
    onError: (error) => {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof SettingSchema>) => {
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      disabled={status === "executing"}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4 ">
                    {!form.getValues("image") && (
                      <div className=" font-bold">
                        {session.session.user?.name
                          ?.charAt(0)
                          .toLocaleUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        className="rounded-full "
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        alt="User Image"
                      />
                    )}
                    <CldUploadWidget
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
                      }
                      options={{
                        multiple: true,
                        resourceType: "image",
                        styles: {
                          palette: {
                            window: "#6d28d9",
                            windowBorder: "#0E2F5A",
                            tabIcon: "#FFF",
                            menuIcons: "#0E2F5A",
                            textDark: "#000000",
                            textLight: "#FFFFFF",
                            link: "#0078FF",
                            action: "#6d28d9",
                            inactiveTabIcon: "#0E2F5A",
                            error: "#F44235",
                            inProgress: "#0078FF",
                            complete: "#20B832",
                            sourceBg: "#E4EBF1",
                          },
                          frame: {
                            background: "#000000",
                          },
                        },
                      }}
                      onSuccess={(result) => {
                        if (result) {
                          setAvatarUploading(false);
                          form.setValue("image", result.info.secure_url!);
                          console.log("result", result.info);
                        }
                      }}
                      onOpen={() => {
                        setAvatarUploading(true);
                      }}
                      onClose={() => {
                        setAvatarUploading(false);
                      }}
                    >
                      {({ open, isLoading }) => {
                        return (
                          <Button type="button" onClick={() => open()}>
                            {isLoading ? "Loading" : "Change Avatar"}
                          </Button>
                        );
                      }}
                    </CldUploadWidget>
                  </div>

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
                      placeholder="*******"
                      disabled={
                        status === "executing" ||
                        session.session.user.isOAuth === true
                      }
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="*******"
                      disabled={
                        status === "executing" ||
                        session.session.user.isOAuth === true
                      }
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isTwoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      disabled={
                        status === "executing" ||
                        session.session.user.isOAuth === true
                      }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={status === "executing" || avatarUploading}
            >
              Update your settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
