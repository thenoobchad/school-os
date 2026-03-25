import { requireAuth } from "@/lib/auth";

import { Card, CardBody } from "@/components/ui/Card";
import Link from "next/link";
import { CheckSquare, ClipboardList, School } from "lucide-react";
import { getTeacherClasses } from "@/actions/teacher.actions";


export default async function TeacherDashboard() {
    const session = await requireAuth(["teacher"]);
    if(!session) null
    const classes = await getTeacherClasses(session.userId);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-500">Welcome back, {session.firstName}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link href="/teacher/attendance">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardBody className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <CheckSquare className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Mark Attendance</p>
                                <p className="text-sm text-gray-500">Record daily attendance</p>
                            </div>
                        </CardBody>
                    </Card>
                </Link>

                <Link href="/teacher/scores">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardBody className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <ClipboardList className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Enter Scores</p>
                                <p className="text-sm text-gray-500">CA & exam scores</p>
                            </div>
                        </CardBody>
                    </Card>
                </Link>

                <Card>
                    <CardBody className="flex items-center gap-4">
                        <div className="p-3 bg-violet-50 rounded-xl">
                            <School className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{classes.length} Classes</p>
                            <p className="text-sm text-gray-500">Assigned to you</p>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {classes.length > 0 && (
                <div>
                    <h2 className="font-semibold text-gray-800 mb-3">My Classes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {classes.map((cls) => (
                            <Card key={cls.classes.id}>
                                <CardBody>
                                    <p className="font-bold text-gray-900">{cls.classes.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">{cls.classes.academicYear} — {cls.classes.gradeLevel}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {/* {cls.classSubjects.length} */}
                                        2
                                        subjects
                                    </p>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}