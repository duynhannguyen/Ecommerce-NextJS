"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export const DashBoardNav = ({
  allLinks,
}: {
  allLinks: { label: string; path: string; icon: JSX.Element }[];
}) => {
  const pathName = usePathname();
  return (
    <nav className="py-2 overflow-auto">
      <ul className="flex gap-6 text-xs font-bold  ">
        <AnimatePresence>
          {allLinks.map((links) => (
            <motion.li key={links.path} whileTap={{ scale: 0.95 }}>
              <Link
                className={cn(
                  "flex gap-1 flex-col items-center relative ",
                  pathName === links.path && "text-primary"
                )}
                href={links.path}
              >
                {links.icon}
                {links.label}
                {pathName === links.path ? (
                  <motion.div
                    className="h-[3px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 35 }}
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
};
