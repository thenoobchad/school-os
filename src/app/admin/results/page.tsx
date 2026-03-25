import { requireAuth } from "@/lib/auth";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAllResults, publishResultAction, unpublishResultAction } from "@/actions/admin.actions";


export default async function AdminResultsPage() {
    await requireAuth(["admin"]);
    const allResults = await getAllResults();

    const columns = [
        {
            key: "student", header: "Student",
            render: (r: any) => `${r.student.firstName} ${r.student.lastName}`,
        },
        {
            key: "class", header: "Class",
            render: (r: any) => r.class?.name ?? "—",
        },
        { key: "term", header: "Term", render: (r: any) => <span className="capitalize">{r.term}</span> },
        { key: "academicYear", header: "Year" },
        { key: "averageScore", header: "Average", render: (r: any) => `${r.averageScore ?? "—"}%` },
        {
            key: "isPublished", header: "Status",
            render: (r: any) => (
                <Badge variant={r.isPublished ? "success" : "warning"}>
                    {r.isPublished ? "Published" : "Draft"}
                </Badge>
            ),
        },
        {
            key: "actions", header: "Actions",
            render: (r: any) => (
                <form action={r.isPublished ? unpublishResultAction.bind(null, r.id) : publishResultAction.bind(null, r.id)}>
                    <Button type="submit" size="sm" variant={r.isPublished ? "outline" : "primary"}>
                        {r.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                </form>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Results Management</h1>
                <p className="text-gray-500 mt-1">Publish or unpublish student results</p>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="font-semibold">All Results ({allResults.length})</h2>
                </CardHeader>
                <CardBody className="p-0">
                    <Table columns={columns} data={allResults} emptyMessage="No results found. Teachers need to compute results first." />
                </CardBody>
            </Card>
        </div>
    );
}