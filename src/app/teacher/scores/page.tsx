"use client";
import { useState, useTransition } from "react";

import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { computeGrade } from "@/lib/utils";
import { Save } from "lucide-react";
import { bulkSaveScoresAction, getStudentsInClass } from "@/actions/teacher.actions";

interface ScoreEntry {
    studentId: string;
    studentName: string;
    ca1: number; ca2: number; ca3: number; exam: number;
}

export default function ScoresPage() {
    const [classId, setClassId] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [term, setTerm] = useState("first");
    const [academicYear, setAcademicYear] = useState("2024/2025");
    const [entries, setEntries] = useState<ScoreEntry[]>([]);
    const [saved, setSaved] = useState(false);
    const [isPending, startTransition] = useTransition();

    function loadStudents() {
        getStudentsInClass(classId).then((students) => {
            setEntries(
                students.map((s: any) => ({
                    studentId: s.userId,
                    studentName: `${s.user.firstName} ${s.user.lastName}`,
                    ca1: 0, ca2: 0, ca3: 0, exam: 0,
                }))
            );
        });
    }

    function updateEntry(studentId: string, field: keyof ScoreEntry, value: number) {
        setEntries((prev) =>
            prev.map((e) => (e.studentId === studentId ? { ...e, [field]: value } : e))
        );
    }

    function handleSave() {
        startTransition(async () => {
            await bulkSaveScoresAction({ entries, subjectId, classId, term, academicYear, teacherId: "" });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        });
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Enter Scores</h1>
                <p className="text-gray-500">Record CA and exam scores for students</p>
            </div>

            {/* Filter bar */}
            <Card className="mb-6">
                <CardBody className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Class ID</label>
                        <input value={classId} onChange={(e) => setClassId(e.target.value)} placeholder="Paste class ID"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Subject ID</label>
                        <input value={subjectId} onChange={(e) => setSubjectId(e.target.value)} placeholder="Paste subject ID"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Term</label>
                        <select value={term} onChange={(e) => setTerm(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                            <option value="first">First Term</option>
                            <option value="second">Second Term</option>
                            <option value="third">Third Term</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Academic Year</label>
                        <input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-full flex justify-end">
                        <Button onClick={loadStudents} variant="secondary">Load Students</Button>
                    </div>
                </CardBody>
            </Card>

            {entries.length > 0 && (
                <Card>
                    <CardHeader>
                        <h2 className="font-semibold">Score Sheet ({entries.length} students)</h2>
                        <p className="text-xs text-gray-400 mt-1">CA1, CA2, CA3 max 10 each | Exam max 70 | Total = 100</p>
                    </CardHeader>
                    <CardBody className="p-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">CA1 /10</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">CA2 /10</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">CA3 /10</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Exam /70</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Total</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {entries.map((e, i) => {
                                        const total = e.ca1 + e.ca2 + e.ca3 + e.exam;
                                        const { grade } = computeGrade(total);
                                        const gradeColors: Record<string, string> = {
                                            A: "text-green-600", B: "text-blue-600", C: "text-yellow-600",
                                            D: "text-orange-500", E: "text-orange-600", F: "text-red-600",
                                        };
                                        return (
                                            <tr key={e.studentId} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                                                <td className="px-4 py-2 font-medium text-gray-800">{e.studentName}</td>
                                                {(["ca1", "ca2", "ca3"] as const).map((field) => (
                                                    <td key={field} className="px-3 py-2 text-center">
                                                        <input
                                                            type="number" min={0} max={10} value={e[field]}
                                                            onChange={(ev) => updateEntry(e.studentId, field, Number(ev.target.value))}
                                                            className="w-16 text-center border rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                ))}
                                                <td className="px-3 py-2 text-center">
                                                    <input
                                                        type="number" min={0} max={70} value={e.exam}
                                                        onChange={(ev) => updateEntry(e.studentId, "exam", Number(ev.target.value))}
                                                        className="w-16 text-center border rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center font-bold text-gray-900">{total}</td>
                                                <td className={`px-4 py-2 text-center font-bold ${gradeColors[grade]}`}>{grade}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                    <CardFooter className="flex justify-between items-center">
                        {saved && <p className="text-sm text-green-600 font-medium">✓ Scores saved!</p>}
                        <div className="ml-auto">
                            <Button onClick={handleSave} loading={isPending}>
                                <Save size={16} /> Save All Scores
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}