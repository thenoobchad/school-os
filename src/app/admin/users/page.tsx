import { requireAuth } from "@/lib/auth";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { deleteUserAction, getAllUsers, toggleUserActiveAction } from "@/actions/admin.actions";



export default async function UsersPage() {
    await requireAuth(["admin"]);
    const allUsers = await getAllUsers();

    const columns = [
        { key: "name", header: "Name", render: (u: any) => `${u.firstName} ${u.lastName}` },
        { key: "email", header: "Email" },
        {
            key: "role", header: "Role",
            render: (u: any) => {
                const v = u.role === "admin" ? "info" : u.role === "teacher" ? "success" : "warning";
                return <Badge variant={v as any} className="capitalize">{u.role}</Badge>;
            },
        },
        {
            key: "isActive", header: "Status",
            render: (u: any) => (
                <Badge variant={u.isActive ? "success" : "danger"}>
                    {u.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            key: "createdAt", header: "Joined",
            render: (u: any) => new Date(u.createdAt).toLocaleDateString(),
        },
        {
            key: "actions", header: "Actions",
            render: (u: any) => (
                <div className="flex gap-2">
                    <form action={toggleUserActiveAction.bind(null, u.id, !u.isActive)}>
                        <Button type="submit" size="sm" variant={u.isActive ? "danger" : "secondary"}>
                            {u.isActive ? "Disable" : "Enable"}
                        </Button>
                    </form>
                    <form action={deleteUserAction.bind(null, u.id)}>
                        <Button type="submit" size="sm" variant="danger">Delete</Button>
                    </form>

                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">{allUsers.length} total users</p>
                </div>
                <Link href="/admin/users/new">
                    <Button><UserPlus size={16} /> Add User</Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="font-semibold text-gray-800">All Users</h2>
                </CardHeader>
                <CardBody className="p-0">
                    <Table columns={columns} data={allUsers} />
                </CardBody>
            </Card>
        </div>
    );
}