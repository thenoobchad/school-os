"use client";
import { useState, useEffect, useTransition } from "react";

import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckSquare } from "lucide-react";
import { markAttendanceAction } from "@/actions/teacher.actions";


type AttendanceStatus = "present" | "absent" | "late";

export default function AttendancePage() {
    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [saved, setSaved] = useState(false);
    const [isPending, startTransition] = useTransition();

    // Load classes on mount — in real app pass session; here we fetch
    useEffect(() => {
        // Normally you'd pass teacher id from session on server component
        // For client simplicity, fetch via a server action exposed differently
        // In a real project you'd use a server component wrapper
    }, []);

    // useEffect(() => {
    //     if (selectedClass) {
    //         getStudentsInClass(selectedClass).then((s) => {
    //             setStudents(s);
    //             const init: Record<string, AttendanceStatus> = {};
    //             s.forEach((st: any) => { init[st.userId] = "present"; });
    //             setAttendance(init);
    //         });
    //     }
    // }, [selectedClass]);

    function toggle(studentId: string, status: AttendanceStatus) {
        setAttendance((prev) => ({ ...prev, [studentId]: status }));
    }

    function handleSave() {
        const formData = new FormData();
        formData.set("classId", selectedClass);
        formData.set("date", date);
        const entries = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status }));
        formData.set("entries", JSON.stringify(entries));

        startTransition(async () => {
            await markAttendanceAction(formData);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        });
    }

    const statusColors: Record<AttendanceStatus, string> = {
        present: "bg-green-100 text-green-700 border-green-300",
        absent: "bg-red-100 text-red-700 border-red-300",
        late: "bg-yellow-100 text-yellow-700 border-yellow-300",
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
                <p className="text-gray-500">Record student attendance for today</p>
            </div>

            <Card className="mb-6">
                <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Select Class</label>
                        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                            <option value="">— Select Class —</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                </CardBody>
            </Card>

            {students.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Students ({students.length})</h2>
                            <div className="flex gap-3 text-sm">
                                <span className="text-green-600 font-medium">
                                    Present: {Object.values(attendance).filter((s) => s === "present").length}
                                </span>
                                <span className="text-red-600 font-medium">
                                    Absent: {Object.values(attendance).filter((s) => s === "absent").length}
                                </span>
                                <span className="text-yellow-600 font-medium">
                                    Late: {Object.values(attendance).filter((s) => s === "late").length}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div className="divide-y divide-gray-100">
                            {students.map((student) => (
                                <div key={student.userId} className="flex items-center justify-between px-6 py-3">
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {student.user.firstName} {student.user.lastName}
                                        </p>
                                        <p className="text-xs text-gray-400">{student.admissionNumber ?? "No admission no."}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {(["present", "absent", "late"] as AttendanceStatus[]).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => toggle(student.userId, s)}
                                                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all capitalize
                          ${attendance[student.userId] === s
                                                        ? statusColors[s]
                                                        : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                    <CardFooter className="flex justify-between items-center">
                        {saved && <p className="text-sm text-green-600 font-medium">✓ Attendance saved!</p>}
                        <div className="ml-auto">
                            <Button onClick={handleSave} loading={isPending}>
                                <CheckSquare size={16} /> Save Attendance
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}

async function getStudentsInClass(selectedClass: string) {
   
}
