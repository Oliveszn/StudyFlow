import {
  BookOpen,
  DollarSign,
  LayoutDashboard,
  Settings,
  Star,
  Users,
  X,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/endpoints/useUser";

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
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
      icon: DollarSign,
      label: "Revenue",
      href: "/instructor/dashboard/tools",
    },

    {
      icon: Settings,
      label: "Settings",
      href: "/instructor/dashboard/settings",
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white z-50 lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-main rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LMS</span>
            </div>
            <span className="font-semibold text-gray-900">Instructor</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isExpanded={true}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {data?.firstName} {data?.lastName}
              </p>
              <p className="text-xs text-gray-500">{data?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
