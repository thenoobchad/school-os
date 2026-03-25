import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduManage — School Management System",
  description: "Complete school management for admins, teachers, and students",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}