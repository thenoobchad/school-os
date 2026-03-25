import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAuth } from "@/lib/auth";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
    await requireAuth(["teacher"]);
    return <DashboardLayout>{children}</DashboardLayout>;
}