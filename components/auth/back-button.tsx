"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type BackButtonType = {
  label: string;
  href: string;
};

const BackButton = ({ label, href }: BackButtonType) => {
  return (
    <Button className="w-full">
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
};
export default BackButton;
