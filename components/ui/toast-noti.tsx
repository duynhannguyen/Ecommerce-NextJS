"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

const ToastNoti = () => {
  const { theme } = useTheme();

  if (typeof theme === "string") {
    return (
      <Toaster
        richColors
        theme={theme as "light" | "dark" | "system" | undefined}
      />
    );
  }

  return <Toaster richColors />;
};

export default ToastNoti;
