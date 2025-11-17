import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth | StagePass",
  description: "Login or register to continue",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex items-center w-full">
      <div className="w-full flex justify-center py-12">{children}</div>
    </div>
  );
}
