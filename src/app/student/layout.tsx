import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAuth } from "@/lib/auth";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    await requireAuth(["student"]);
    return <DashboardLayout>{children}</DashboardLayout>;
}