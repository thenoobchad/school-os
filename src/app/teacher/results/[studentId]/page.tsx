
import { requireAuth } from "@/lib/auth";
import { ResultCard } from "@/components/shared/ResultCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStudentFullResult } from "@/actioins/teacher.actions";

interface Props {
    params: { studentId: string };
    searchParams: { classId?: string; term?: string; year?: string };
}

export default async function StudentResultPage({ params, searchParams }: Props) {
    await requireAuth(["teacher"]);

    const classId = searchParams.classId ?? "";
    const term = searchParams.term ?? "first";
    const academicYear = searchParams.year ?? "2024/2025";

    const { scores, result, studentProfile } = await getStudentFullResult(
        params.studentId, classId, term, academicYear
    );

    if (!studentProfile) return <p className="text-gray-500 p-8">Student not found.</p>;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Link href="/teacher"><Button variant="ghost" size="sm"><ArrowLeft size={16} /> Back</Button></Link>
                <h1 className="text-2xl font-bold text-gray-900">Student Result</h1>
            </div>

            {scores.length === 0 ? (
                <p className="text-gray-500">No scores found for this student and term.</p>
            ) : (
                <ResultCard
                    studentName={`${studentProfile.user.firstName} ${studentProfile.user.lastName}`}
                    admissionNumber={studentProfile.admissionNumber ?? "N/A"}
                    className={studentProfile.class?.name ?? "Unknown"}
                    academicYear={academicYear}
                    term={term}
                    scores={scores as any}
                    totalScore={result?.totalScore ?? "0"}
                    averageScore={result?.averageScore ?? "0"}
                    position={result?.position ?? undefined}
                    teacherRemark={result?.teacherRemark ?? undefined}
                    principalRemark={result?.principalRemark ?? undefined}
                />
            )}
        </div>
    );
}