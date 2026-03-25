"use server";

import { db } from "@/db";
import { attendance, scores, results, students } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "@/lib/auth";

//Get My Results 
export async function getMyResults(studentId: string) {
    return db.query.results.findMany({
        where: and(eq(results.studentId, studentId), eq(results.isPublished, true)),
        with: { class: true },
        orderBy: (r, { desc }) => [desc(r.createdAt)],
    });
}

//Get My Scores for a term 
export async function getMyScores(
    studentId: string, classId: string, term: string, academicYear: string
) {
    return db.query.scores.findMany({
        where: and(
            eq(scores.studentId, studentId),
            eq(scores.classId, classId),
            eq(scores.term, term as any),
            eq(scores.academicYear, academicYear)
        ),
        with: { subject: true },
    });
}

// Get My Attendance 
export async function getMyAttendance(studentId: string, classId: string) {
    return db.query.attendance.findMany({
        where: and(
            eq(attendance.studentId, studentId),
            eq(attendance.classId, classId)
        ),
        orderBy: (a, { desc }) => [desc(a.date)],
    });
}

//Get My Profile 
export async function getMyProfile(userId: string) {
    return db.query.students.findFirst({
        where: eq(students.userId, userId),
        with: { user: true, class: true },
    });
}