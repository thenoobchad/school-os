import { requireAuth } from "@/lib/auth";

import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";
import { FileText, CheckSquare, User } from "lucide-react";
import { getMyProfile } from "@/actions/student.actions";


export default async function StudentDashboard() {
    const session = await requireAuth(["student"]);
    const profile = await getMyProfile(session.userId);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {session.firstName}!
                </h1>
                <p className="text-gray-500">Here's your academic overview.</p>
            </div>

            {profile && (
                <Card className="mb-6 border-violet-200">
                    <CardBody className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-violet-100 rounded-full flex items-center justify-center">
                            <User className="text-violet-600 w-7 h-7" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg">
                                {profile.user.firstName} {profile.user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                                {profile.admissionNumber ?? "—"} | {profile.class?.name ?? "No class assigned"}
                            </p>
                            <p className="text-xs text-gray-400">{profile.user.email}</p>
                        </div>
                    </CardBody>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/student/results">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-violet-100">
                        <CardBody className="flex items-center gap-4">
                            <div className="p-3 bg-violet-50 rounded-xl">
                                <FileText className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">My Results</p>
                                <p className="text-sm text-gray-500">View and print term results</p>
                            </div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/student/attendance">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-violet-100">
                        <CardBody className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <CheckSquare className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">My Attendance</p>
                                <p className="text-sm text-gray-500">View attendance history</p>
                            </div>
                        </CardBody>
                    </Card>
                </Link>
            </div>
        </div>
    );
}