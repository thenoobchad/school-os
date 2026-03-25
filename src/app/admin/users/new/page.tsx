"use client";
import { useState, useTransition } from "react";

import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createUserAction } from "@/actions/admin.actions";

export default function NewUserPage() {
    const [role, setRole] = useState<"admin" | "teacher" | "student">("student");
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setError("");
        startTransition(async () => {
            const result = await createUserAction(formData);
            if (result?.error) setError(result.error as string);
            else router.push("/admin/users");
        });
    }

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/users">
                    <Button variant="ghost" size="sm"><ArrowLeft size={16} /> Back</Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
                    <p className="text-sm text-gray-500">Create a new admin, teacher, or student account</p>
                </div>
            </div>

            <Card>
                <CardHeader><h2 className="font-semibold">User Details</h2></CardHeader>
                <form action={handleSubmit}>
                    <CardBody className="space-y-4">
                        {error && (
                            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input id="firstName" name="firstName" label="First Name" required />
                            <Input id="lastName" name="lastName" label="Last Name" required />
                        </div>

                        <Input id="email" name="email" type="email" label="Email Address" required />
                        <Input id="password" name="password" type="password" label="Password"
                            hint="Minimum 8 characters" required />
                        <Input id="phone" name="phone" type="tel" label="Phone Number" />

                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                name="role" value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {role === "student" && (
                            <div className="space-y-4 pt-2 border-t">
                                <p className="text-sm font-medium text-gray-600">Student Details</p>
                                <Input id="admissionNumber" name="admissionNumber" label="Admission Number" />
                                <Input id="classId" name="classId" label="Class ID" hint="Get from Classes page" />
                            </div>
                        )}

                        {role === "teacher" && (
                            <div className="space-y-4 pt-2 border-t">
                                <p className="text-sm font-medium text-gray-600">Teacher Details</p>
                                <Input id="staffId" name="staffId" label="Staff ID" />
                                <Input id="qualification" name="qualification" label="Qualification" />
                            </div>
                        )}
                    </CardBody>
                    <CardFooter className="flex justify-end gap-3">
                        <Link href="/admin/users">
                            <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button type="submit" loading={isPending}>Create User</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}