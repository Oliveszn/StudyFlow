"use client";
import {
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/endpoints/useUser";

interface DesktopSidebarProps {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DesktopSidebar({
  isExpanded,
  setIsExpanded,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const { data } = useProfile();
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/instructor/dashboard",
    },
    {
      icon: BookOpen,
      label: "My Courses",
      href: "/instructor/dashboard/courses",
    },
    {
      icon: Users,
      label: "Performance",
      href: "/instructor/dashboard/performance",
    },
    {
      icon: Wrench,
      label: "Tools",
      href: "/instructor/dashboard/tools",
    },

    {
      icon: Settings,
      label: "Settings",
      href: "/instructor/dashboard/settings",
    },
  ];

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`
        hidden lg:flex fixed left-0 top-0 h-screen bg-white border-r border-gray-200
        flex-col transition-all duration-300 ease-in-out z-40
        ${isExpanded ? "w-64" : "w-20"}
      `}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
        <div
          className={`flex items-center gap-2 ${
            !isExpanded ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 bg-main rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">LMS</span>
          </div>
          <span
            className={`
              font-semibold text-gray-900 transition-all duration-200
              ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
            `}
          >
            StudyFlow
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isExpanded={isExpanded}
            isActive={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div
          className={`flex items-center gap-3 ${
            !isExpanded ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0" />
          <div
            className={`
              transition-all duration-200
              ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
            `}
          >
            <p className="text-sm font-medium text-gray-900">
              {data?.firstName} {data?.lastName}
            </p>
            <p className="text-xs text-gray-500 normal-case">{data?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
