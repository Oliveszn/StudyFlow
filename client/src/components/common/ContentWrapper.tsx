import { ReactNode } from "react";

interface ContentWrapperProps {
  children: ReactNode;
}

export default function ContentWrapper({ children }: ContentWrapperProps) {
  return (
    <div className="px-6 sm:px-8 lg:px-10 py-16">
      <div className="max-w-7xl mx-auto ">{children}</div>
    </div>
  );
}
