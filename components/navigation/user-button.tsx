"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { LogOut, Moon, SettingsIcon, Sun, TruckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

const UserButton = ({ user }: Session) => {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setSwitchState();
  }, []);
  const setSwitchState = () => {
    switch (theme) {
      case "dark":
        return setChecked(true);

      case "light":
        return setChecked(false);
      default:
        return setChecked(false);
    }
  };
  if (user)
    return (
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar className="bg-primary/25">
              {user.image && (
                <Image
                  src={user.image}
                  alt={user.name!}
                  fill={true}
                  sizes="(max-width: 40px) 100vw, (max-width: 40) 50vw, 33vw"
                  priority={true}
                />
              )}
              {!user.image && (
                <AvatarFallback>
                  <div className="font-bold ">
                    {user.name?.charAt(0).toLocaleUpperCase()}
                  </div>
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-6 " align="end">
            <div className="mb-4 p-4 flex flex-col gap-1 items-center rounded-lg  bg-primary/10">
              {user.image && (
                <Image
                  className="rounded-full  "
                  src={user.image}
                  alt={user.name!}
                  width={36}
                  height={36}
                  sizes="(max-width: 40px) 100vw, (max-width: 40) 50vw, 33vw"
                  priority={true}
                />
              )}
              <p className=" font-bold text-xs"> {user.name} </p>
              <span className="text-xs font-medium text-secondary-foreground ">
                {" "}
                {user.email}{" "}
              </span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/orders")}
              className=" group py-2 font-medium cursor-pointer transition-all  ease-in-out "
            >
              {" "}
              <TruckIcon
                size={15}
                className="mr-3 group-hover:translate-x-1 transition-all duration-300 "
              />{" "}
              My orders
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className=" group py-2 font-medium cursor-pointer transition-all  ease-in-out "
            >
              {" "}
              <SettingsIcon
                size={15}
                className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
              />{" "}
              Setting
            </DropdownMenuItem>
            {theme && (
              <DropdownMenuItem className=" py-2 font-medium cursor-pointer transition-all  ease-in-out ">
                <div
                  onClick={(e) => e.stopPropagation()}
                  className=" flex items-center group "
                >
                  <div className="relative flex mr-3 ">
                    <Sun
                      className=" absolute  group-hover:text-yellow-600 group-hover:rotate-180 dark:scale-0 drak: -rotate-90 transition-all duration-300 ease-in-out "
                      size={15}
                    />
                    <Moon
                      className="group-hover:text-blue-400 transition-all duration-300 ease-in-out dark:scale-100 scale-0 "
                      size={15}
                    />
                  </div>
                  <p className="dark:text-blue-400 text-secondary-foreground/75  text-yellow-400   ">
                    {theme[0].toUpperCase() + theme?.slice(1)} Mode
                  </p>{" "}
                  <Switch
                    className="scale-75 ml-2"
                    checked={checked}
                    onCheckedChange={(e) => {
                      setChecked((prev) => !prev);
                      if (e) setTheme("dark");
                      if (!e) setTheme("light");
                    }}
                  />
                </div>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => signOut()}
              className=" group py-2 focus:bg-destructive/30 font-medium cursor-pointer transition-all ease-in-out "
            >
              <LogOut
                size={15}
                className="mr-3 group-hover:scale-75 transition-all duration-300 ease-in-out"
              />{" "}
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
};

export default UserButton;
