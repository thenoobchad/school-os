import { Sidebar } from "./Sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session) redirect("/auth");

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar role={session.role} userName={`${session.firstName} ${session.lastName}`} />
            <main className="flex-1 overflow-auto">
                <div className="p-6 max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}