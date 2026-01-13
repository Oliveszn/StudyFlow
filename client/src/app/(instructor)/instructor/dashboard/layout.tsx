"use client";
import Header from "@/components/instructor/dashboard/Header";
import MobileSidebar from "@/components/instructor/dashboard/MobileSidebar";
import DesktopSidebar from "@/components/instructor/dashboard/Sidebar";
import { ReactNode, useState } from "react";

interface DashboardProps {
  children: ReactNode;
}

const InstructorDashboardLayout = ({ children }: DashboardProps) => {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-gray-100">
      <DesktopSidebar
        isExpanded={isDesktopExpanded}
        setIsExpanded={setIsDesktopExpanded}
      />

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="lg:ml-20 pt-16 min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default InstructorDashboardLayout;
