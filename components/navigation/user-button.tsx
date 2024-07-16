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

const UserButton = ({ user }: Session) => {
  if (user)
    return (
      <div>
        <DropdownMenu>
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
            <div className="mb-4 p-4 flex flex-col gap-1 items-center rounded-lg  bg-primary/25">
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
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
};

export default UserButton;
