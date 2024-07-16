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

const UserButton = ({ user }: Session) => {
  if (user)
    return (
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar className="bg-primary/25">
              {user.image && (
                <Image src={user.image} alt={user.name!} fill={true} />
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
                />
              )}
              <p className=" font-bold text-xs"> {user.name} </p>
              <span className="text-xs font-medium text-secondary-foreground ">
                {" "}
                {user.email}{" "}
              </span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className=" group py-2 font-medium cursor-pointer transition-all duration-500 ">
              {" "}
              <TruckIcon
                size={15}
                className="mr-3 group-hover:translate-x-1 transition-all duration-300 "
              />{" "}
              My orders
            </DropdownMenuItem>
            <DropdownMenuItem className=" group py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out ">
              {" "}
              <SettingsIcon
                size={15}
                className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
              />{" "}
              Setting
            </DropdownMenuItem>
            <DropdownMenuItem className=" py-2 font-medium cursor-pointer transition-all duration-500 ">
              <div className=" flex items-center">
                <Sun size={15} />
                <Moon size={15} />
                <p>
                  Theme <span>Theme</span>{" "}
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut()}
              className=" group py-2 focus:bg-destructive/30 font-medium cursor-pointer transition-all duration-500 "
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
