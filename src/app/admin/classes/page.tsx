import { requireAuth } from "@/lib/auth";

import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { School } from "lucide-react";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { getAllClasses, getAllUsers } from "@/actions/admin.actions";

export default async function ClassesPage() {
    await requireAuth(["admin"]);
    const allClasses = await getAllClasses();
    const teachers = (await getAllUsers()).filter((u) => u.role === "teacher");

    const columns = [
        { key: "name", header: "Class Name" },
        { key: "gradeLevel", header: "Grade" },
        { key: "academicYear", header: "Academic Year" },
        {
            key: "teacher", header: "Class Teacher",
            render: (c: any) => c.teacher ? `${c.teacher.firstName} ${c.teacher.lastName}` : "—",
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
                    <p className="text-gray-500 mt-1">{allClasses.length} classes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create form */}
                <Card>
                    <CardHeader><h2 className="font-semibold">Create Class</h2></CardHeader>
                    <CardBody>
                        <form className="space-y-3">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Class Name</label>
                                <input name="name" placeholder="e.g. JSS1A" required
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Grade Level</label>
                                <select name="gradeLevel"
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                                    {["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"].map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                                <input name="academicYear" placeholder="e.g. 2024/2025" required
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Class Teacher</label>
                                <select name="teacherId"
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                                    <option value="">— Select Teacher —</option>
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full"><School size={16} /> Create Class</Button>
                        </form>
                    </CardBody>
                </Card>

                {/* Table */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader><h2 className="font-semibold">All Classes</h2></CardHeader>
                        <CardBody className="p-0">
                            <Table columns={columns} data={allClasses} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}