"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import React from "react";
import { getInitials } from "@/helpers/getInitials";

type Props = {
  firstName: string;
  lastName?: string;
  role?: string;
};

export default function NavUserDropdown({ firstName, lastName, role }: Props) {
  const router = useRouter();
  const isInstructor = role === "INSTRUCTOR";

  const initials = getInitials(firstName, lastName);

  const allMenuItems: {
    label: string;
    path?: string;
    danger?: boolean;
    instructorOnly?: boolean;
    hideForInstructor?: boolean;
    onClick?: () => void;
  }[] = [
    { label: "My Learning", path: "/my-learning", hideForInstructor: true },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Profile", path: "/profile" },
    { label: "Settings", path: "/settings" },
    {
      label: "Log out",
      danger: true,
      onClick: () => {
        router.push("/");
      },
    },
  ];

  const menuItems = allMenuItems.filter((item) => {
    if (isInstructor && item.hideForInstructor) return false;
    return true;
  });

  const handleClick = (item: (typeof menuItems)[0]) => {
    if (item.onClick) return item.onClick();
    if (item.path) router.push(item.path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer h-9 w-9">
          <AvatarFallback className="bg-[#16161D] text-white text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {/* {menuItems.map((item, index) =>
          item.label === "Profile" || item.label === "Settings" ? (
            <React.Fragment key={item.label}>
              {index === 2 && <DropdownMenuSeparator key="sep-1" />}
              <DropdownMenuItem
                onClick={() => handleClick(item)}
                className={item.danger ? "text-red-600 focus:text-red-600" : ""}
              >
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          ) : (
            <DropdownMenuItem
              key={item.label}
              onClick={() => handleClick(item)}
              className={item.danger ? "text-red-600 focus:text-red-600" : ""}
            >
              {item.label}
            </DropdownMenuItem>
          ),
        )} */}
        {menuItems.map((item, index) =>
          item.label === "Profile" || item.label === "Settings" ? (
            <React.Fragment key={item.label}>
              {index > 0 && menuItems[index - 1].label !== "Profile" && (
                <DropdownMenuSeparator />
              )}
              <DropdownMenuItem
                onClick={() => handleClick(item)}
                className={item.danger ? "text-red-600 focus:text-red-600" : ""}
              >
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          ) : (
            <DropdownMenuItem
              key={item.label}
              onClick={() => handleClick(item)}
              className={item.danger ? "text-red-600 focus:text-red-600" : ""}
            >
              {item.label}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
