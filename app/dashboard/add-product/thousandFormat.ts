"use client";

// import { ChangeEvent } from "react";
// import { useFormContext } from "react-hook-form";

// export const ThousandFormat = (values: number) => {
//   const stringNumber = String(values);
//   const numericValue = parseInt(stringNumber, 10);
//   console.log("numericValue", numericValue);
//   return numericValue.toLocaleString("en-US");
// };

export const formatNumber = (value: string) => {
  const numericValue = parseInt(value, 10);
  return new Intl.NumberFormat("en-US").format(numericValue);
};
