import { requireAuth } from "@/lib/auth";

import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ResultCard } from "@/components/shared/ResultCard";
import { getMyProfile, getMyResults, getMyScores } from "@/actions/student.actions";

export default async function StudentResultsPage() {
    const session = await requireAuth(["student"]);
    const results = await getMyResults(session.userId);
    const profile = await getMyProfile(session.userId);

    if (!profile?.classId) {
        return (
            <div className="text-center py-16 text-gray-500">
                <p className="text-lg font-medium">No class assigned yet.</p>
                <p className="text-sm mt-1">Contact your administrator to be assigned to a class.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
                <p className="text-gray-500">{results.length} published result(s)</p>
            </div>

            {results.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-12 text-gray-500">
                        <p>No published results yet. Check back after your teacher computes your result.</p>
                    </CardBody>
                </Card>
            ) : (
                <div className="space-y-8">
                    {results.map(async (result) => {
                        const termScores = await getMyScores(
                            session.userId, result.classId, result.term, result.academicYear
                        );
                        return (
                            <div key={result.id}>
                                <div className="flex items-center gap-3 mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800 capitalize">
                                        {result.term} Term — {result.academicYear}
                                    </h2>
                                    <Badge variant="success">Published</Badge>
                                </div>
                                <ResultCard
                                    studentName={`${session.firstName} ${session.lastName}`}
                                    admissionNumber={profile.admissionNumber ?? "N/A"}
                                    className={result.class?.name ?? "—"}
                                    academicYear={result.academicYear}
                                    term={result.term}
                                    scores={termScores as any}
                                    totalScore={result.totalScore ?? "0"}
                                    averageScore={result.averageScore ?? "0"}
                                    position={result.position ?? undefined}
                                    teacherRemark={result.teacherRemark ?? undefined}
                                    principalRemark={result.principalRemark ?? undefined}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}