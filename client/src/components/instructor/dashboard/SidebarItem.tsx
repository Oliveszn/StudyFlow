import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isExpanded: boolean;
  isActive: boolean;
}
export default function SidebarItem({
  icon: Icon,
  label,
  href,
  isExpanded,
  isActive,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
        ${isActive ? "bg-main text-white" : "text-gray-700 hover:bg-gray-100"}
        ${!isExpanded ? "justify-center" : ""}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span
        className={`
          whitespace-nowrap transition-all duration-200
          ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
        `}
      >
        {label}
      </span>
    </Link>
  );
}
