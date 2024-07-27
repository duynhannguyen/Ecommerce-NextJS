"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import * as z from "zod";
import { VariantSchema } from "@/types/variant-schema";
import { ChangeEvent, useState } from "react";
import { cn } from "@/lib/utils";
const UploadButton = () => {
  const [value, setValue] = useState<number>(0);
  const { control, getValues, setError } =
    useFormContext<z.infer<typeof VariantSchema>>();

  const { fields, remove, append, update, move } = useFieldArray({
    control: control,
    name: "variantImages",
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return null;
    }
    setValue(value + e.target.files.length);
  };
  return (
    <form>
      <div className="border relative  h-64">
        <div className="z-10 absolute top-1/2 left-1/2 text-center -translate-x-1/2 -translate-y-1/2 whitespace-nowrap  ">
          Drag & drop yours image to upload
          <p
            className={cn(
              "mt-2 bg-secondary p-2 rounded-md transition-all duration-300  ",
              value ? "bg-primary" : null
            )}
          >
            {" "}
            {value} files uploaded{" "}
          </p>
        </div>
        <Input
          id="image-upload"
          className=" h-full z-20 absolute top-1/2 left-1/2 border-red-500 border -translate-x-1/2 -translate-y-1/2 opacity-0   "
          type="file"
          title="Upload image"
          multiple
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default UploadButton;
