"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/Button";
import { computeGrade } from "@/lib/utils";
import { Printer } from "lucide-react";

interface ScoreRow {
    subject: { name: string; code: string };
    ca1: string | null;
    ca2: string | null;
    ca3: string | null;
    exam: string | null;
    total: string | null;
    grade: string | null;
    remark: string | null;
}

interface ResultCardProps {
    studentName: string;
    admissionNumber: string;
    className: string;
    academicYear: string;
    term: string;
    scores: ScoreRow[];
    totalScore: string;
    averageScore: string;
    position?: number;
    teacherRemark?: string;
    principalRemark?: string;
    schoolName?: string;
}

export function ResultCard({
    studentName, admissionNumber, className, academicYear, term,
    scores, totalScore, averageScore, position, teacherRemark,
    principalRemark, schoolName = "EduManage Academy",
}: ResultCardProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Result_${studentName}_${term}_${academicYear}`,
    });

    const termMap: Record<string, string> = {
        first: "First Term", second: "Second Term", third: "Third Term",
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={handlePrint} variant="primary">
                    <Printer size={16} /> Print Result
                </Button>
            </div>

            <div ref={printRef} className="bg-white p-8 max-w-4xl mx-auto print:p-4">
                {/* Header */}
                <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-blue-700">{schoolName}</h1>
                    <p className="text-sm text-gray-500 mt-1">Student Academic Report</p>
                    <p className="text-sm font-medium mt-1">{academicYear} Academic Session — {termMap[term] ?? term}</p>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="space-y-1">
                        <InfoRow label="Student Name" value={studentName} />
                        <InfoRow label="Admission No." value={admissionNumber} />
                        <InfoRow label="Class" value={className} />
                    </div>
                    <div className="space-y-1">
                        <InfoRow label="Term" value={termMap[term] ?? term} />
                        <InfoRow label="Academic Year" value={academicYear} />
                        {position && <InfoRow label="Position" value={`${position}${ordinal(position)}`} />}
                    </div>
                </div>

                {/* Scores Table */}
                <table className="w-full text-sm border-collapse mb-6">
                    <thead>
                        <tr className="bg-blue-600 text-white">
                            <th className="border border-blue-500 px-3 py-2 text-left">Subject</th>
                            <th className="border border-blue-500 px-3 py-2">CA1 (10)</th>
                            <th className="border border-blue-500 px-3 py-2">CA2 (10)</th>
                            <th className="border border-blue-500 px-3 py-2">CA3 (10)</th>
                            <th className="border border-blue-500 px-3 py-2">Exam (70)</th>
                            <th className="border border-blue-500 px-3 py-2">Total (100)</th>
                            <th className="border border-blue-500 px-3 py-2">Grade</th>
                            <th className="border border-blue-500 px-3 py-2">Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((s, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                <td className="border border-gray-200 px-3 py-2 font-medium">{s.subject.name}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center">{s.ca1 ?? "—"}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center">{s.ca2 ?? "—"}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center">{s.ca3 ?? "—"}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center">{s.exam ?? "—"}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center font-bold">{s.total ?? "—"}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center font-bold text-blue-600">{s.grade ?? "—"}</td>
                                <td className="border border-gray-200 px-3 py-2 text-center text-gray-500">{s.remark ?? "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-blue-50 font-bold">
                            <td className="border border-gray-200 px-3 py-2" colSpan={5}>Summary</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">{totalScore}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">Avg: {averageScore}</td>
                            <td className="border border-gray-200 px-3 py-2 text-center">{computeGrade(parseFloat(averageScore)).grade}</td>
                        </tr>
                    </tfoot>
                </table>

                {/* Grade Key */}
                <div className="grid grid-cols-6 gap-2 text-xs mb-6 border rounded-lg p-3 bg-gray-50">
                    <GradeKey grade="A" range="70–100" remark="Excellent" />
                    <GradeKey grade="B" range="60–69" remark="Very Good" />
                    <GradeKey grade="C" range="50–59" remark="Good" />
                    <GradeKey grade="D" range="45–49" remark="Pass" />
                    <GradeKey grade="E" range="40–44" remark="Fair" />
                    <GradeKey grade="F" range="0–39" remark="Fail" />
                </div>

                {/* Remarks */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Class Teacher's Remark</p>
                        <p className="text-gray-700 italic">"{teacherRemark || "No remark provided"}"</p>
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-400">Signature: ___________________</p>
                        </div>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Principal's Remark</p>
                        <p className="text-gray-700 italic">"{principalRemark || "Keep up the good work!"}"</p>
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-400">Signature: ___________________</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t text-center text-xs text-gray-400">
                    <p>Generated by EduManage — This is an official academic document.</p>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex gap-2">
            <span className="text-gray-500 w-32 shrink-0">{label}:</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
}

function GradeKey({ grade, range, remark }: { grade: string; range: string; remark: string }) {
    return (
        <div className="text-center">
            <span className="font-bold text-blue-600">{grade}</span>
            <span className="text-gray-500 ml-1">({range})</span>
            <p className="text-gray-400">{remark}</p>
        </div>
    );
}

function ordinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}