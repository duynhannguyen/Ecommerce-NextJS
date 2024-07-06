"use client";

import { useEffect } from "react";

const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="flex justify-center items-center flex-col text-lg w-full min-h-56 ">
      <h2> Some thing went worng {error.message}</h2>
      <h3></h3>
      <button onClick={() => reset()}> Try again </button>
    </div>
  );
};

export default ErrorPage;
