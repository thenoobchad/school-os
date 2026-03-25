import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { requireAuth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAuth(["admin"]);
    return <DashboardLayout>{children}</DashboardLayout>;
}