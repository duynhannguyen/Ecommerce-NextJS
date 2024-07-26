"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VariantSchema } from "@/types/variant-schema";
import { CldUploadWidget } from "next-cloudinary";
import { useFieldArray, useFormContext } from "react-hook-form";
import * as z from "zod";
const VariantsImages = () => {
  const { getValues, control, setError } =
    useFormContext<z.infer<typeof VariantSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control,
    name: "variantImages",
  });

  return (
    <FormField
      control={control}
      name="variantImages"
      render={({ field }) => (
        <FormItem className="z-[60]">
          <FormLabel></FormLabel>
          <FormControl className="z-[60]">
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_AVATAR}
              options={{
                showUploadMoreButton: true,
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
              //   onError={(error) => {
              //     console.log("error", error);
              //   }}
              //   onSuccess={(result) => {
              //     if (result) {
              //       //   setAvatarUploading(false);
              //       //   form.setValue(
              //       //     "image",
              //       //     result?.info?.secure_url as string
              //       //   );
              //       //   console.log("result", result.info);
              //     }
              //   }}
              //   onClose={() => {
              //     // setAvatarUploading(false);
              //   }}
            >
              {({ open, isLoading }) => {
                return (
                  <Button type="button" onClick={() => open()}>
                    {isLoading ? "Loading" : "Upload image"}
                  </Button>
                );
              }}
            </CldUploadWidget>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VariantsImages;
