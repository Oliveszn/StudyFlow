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

type Props = {
  firstName: string;
  lastName?: string;
};

export default function NavUserDropdown({ firstName, lastName }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Combine names and get first 2 initials
  const getInitials = (first: string, last?: string) => {
    const full = [first, last].filter(Boolean).join(" ");
    return full
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(firstName, lastName);

  const menuItems: {
    label: string;
    path?: string;
    danger?: boolean;
    onClick?: () => void;
  }[] = [
    { label: "My Learning", path: "/my-learning" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Profile", path: "/profile" },
    { label: "Settings", path: "/settings" },
    {
      label: "Log out",
      danger: true,
      onClick: () => {
        // dispatch(logout());
        router.push("/");
      },
    },
  ];

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
        {menuItems.map((item, index) =>
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
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
