import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { users, classes, subjects, results } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { Card, CardBody } from "@/components/ui/Card";
import { Users, School, BookOpen, FileText } from "lucide-react";

export default async function AdminDashboard() {
    const session = await requireAuth(["admin"]);

    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [totalClasses] = await db.select({ count: count() }).from(classes);
    const [totalSubjects] = await db.select({ count: count() }).from(subjects);
    const [totalResults] = await db.select({ count: count() }).from(results);
    const [studentCount] = await db.select({ count: count() }).from(users).where(eq(users.role, "student"));
    const [teacherCount] = await db.select({ count: count() }).from(users).where(eq(users.role, "teacher"));

    const stats = [
        { label: "Total Users", value: totalUsers.count, icon: <Users className="w-6 h-6" />, color: "text-blue-600 bg-blue-50" },
        { label: "Students", value: studentCount.count, icon: <Users className="w-6 h-6" />, color: "text-violet-600 bg-violet-50" },
        { label: "Teachers", value: teacherCount.count, icon: <Users className="w-6 h-6" />, color: "text-emerald-600 bg-emerald-50" },
        { label: "Classes", value: totalClasses.count, icon: <School className="w-6 h-6" />, color: "text-amber-600 bg-amber-50" },
        { label: "Subjects", value: totalSubjects.count, icon: <BookOpen className="w-6 h-6" />, color: "text-rose-600 bg-rose-50" },
        { label: "Results", value: totalResults.count, icon: <FileText className="w-6 h-6" />, color: "text-indigo-600 bg-indigo-50" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, {session.firstName}. Here's your overview.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardBody className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}