import { requireAuth } from "@/lib/auth";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { BookOpen } from "lucide-react";
import { getAllSubjects } from "@/actions/admin.actions";


export default async function SubjectsPage() {
    await requireAuth(["admin"]);
    const allSubjects = await getAllSubjects();

    const columns = [
        { key: "name", header: "Subject Name" },
        { key: "code", header: "Code" },
        { key: "createdAt", header: "Created", render: (s: any) => new Date(s.createdAt).toLocaleDateString() },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Subject Management</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><h2 className="font-semibold">Add Subject</h2></CardHeader>
                    <CardBody>
                        <form className="space-y-3">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                                <input name="name" placeholder="e.g. Mathematics" required
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Subject Code</label>
                                <input name="code" placeholder="e.g. MTH101" required
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <Button type="submit" className="w-full"><BookOpen size={16} /> Add Subject</Button>
                        </form>
                    </CardBody>
                </Card>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader><h2 className="font-semibold">All Subjects ({allSubjects.length})</h2></CardHeader>
                        <CardBody className="p-0">
                            <Table columns={columns} data={allSubjects} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
