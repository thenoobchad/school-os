"use server"

import { db } from "@/db";
import { attendance, classes, classSubjects, results, scores, students, subjects } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { computeGrade } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

//Get Teachers Classes
export async function getTeacherClasses(teacherId: string) {
    // return await db.query.classes.findMany({
    //     where: eq(classes.teacherId, teacherId),
    //     with: { classSubjects: { with: { subject: true } } },
    // });

    const data = await db.select().from(classes).leftJoin(classSubjects, eq(classes.id, classSubjects.classId)).where(eq(classes.teacherId, teacherId))
    return data
}

//Get Students in a class
export async function getStudentsInClass(classId: string) {
    return db.query.students.findMany({
        where: eq(students.classId, classId),
        with: { user: true },
    });
}

//Mark Attendance

export async function markAttendanceAction(formData: FormData) {
    const session = await requireAuth(["teacher"]);
    const classId = formData.get("classId") as string;
    const date = formData.get("date") as string;

    // Attendance entries come as JSON string
    const entries = JSON.parse(formData.get("entries") as string) as Array<{
        studentId: string;
        status: "present" | "absent" | "late";
        remark?: string;
    }>;

    // Delete existing attendance for this class/date
    await db.delete(attendance).where(
        and(eq(attendance.classId, classId), eq(attendance.date, date))
    );

    // Insert new
    await db.insert(attendance).values(
        entries.map((e) => ({
            studentId: e.studentId,
            classId,
            date,
            status: e.status as "present" | "absent",
            remark: e.remark || null,
            markedById: session.userId,
        }))
    );

    revalidatePath("/teacher/attendance");
    return { success: true };
}

//Get Attendance for class + date

export async function getAttendanceForDate(classId: string, date: string) {
    return db.query.attendance.findMany({
        where: and(eq(attendance.classId, classId), eq(attendance.date, date)),
        with: { student: true },
    });
}

//Save/Update
export async function saveScoreAction(formData: FormData) {
    const session = await requireAuth(["teacher"]);

    const studentId = formData.get("studentId") as string;
    const subjectId = formData.get("subjectId") as string;
    const classId = formData.get("classId") as string;
    const term = formData.get("term") as any;
    const academicYear = formData.get("academicYear") as string;
    const ca1 = parseFloat(formData.get("ca1") as string) || 0;
    const ca2 = parseFloat(formData.get("ca2") as string) || 0;
    const ca3 = parseFloat(formData.get("ca3") as string) || 0;
    const exam = parseFloat(formData.get("exam") as string) || 0;

    // Validation
    if (ca1 > 10 || ca2 > 10 || ca3 > 10) return { error: "CA scores max 10 each" };
    if (exam > 70) return { error: "Exam score max 70" };

    const total = ca1 + ca2 + ca3 + exam;
    const { grade, remark } = computeGrade(total);

    // Upsert
    const existing = await db.query.scores.findFirst({
        where: and(
            eq(scores.studentId, studentId),
            eq(scores.subjectId, subjectId),
            eq(scores.classId, classId),
            eq(scores.term, term),
            eq(scores.academicYear, academicYear)
        ),
    });

    if (existing) {
        await db.update(scores).set({
            ca1: ca1.toString(), ca2: ca2.toString(),
            exam: exam.toString(), total: total.toString(), grade, remark,
            recordedById: session.userId, updatedAt: new Date(),
        }).where(eq(scores.id, existing.id));
    } else {
        await db.insert(scores).values({
            studentId, subjectId, classId, term, academicYear,
            ca1: ca1.toString(), ca2: ca2.toString(),
            exam: exam.toString(), total: total.toString(), grade, remark,
            recordedById: session.userId,
        });
    }

    revalidatePath("/teacher/scores");
    return { success: true };
}


//Bulk save scores for all students in a class/subject

export async function bulkSaveScoresAction(data: {
    entries: Array<{ studentId: string; ca1: number; ca2: number; ca3: number; exam: number }>;
    subjectId: string;
    classId: string;
    term: string;
    academicYear: string;
    teacherId: string;
}) {
    await requireAuth(["teacher"]);

    for (const entry of data.entries) {
        const total = entry.ca1 + entry.ca2 + entry.ca3 + entry.exam;
        const { grade, remark } = computeGrade(total);

        const existing = await db.query.scores.findFirst({
            where: and(
                eq(scores.studentId, entry.studentId),
                eq(scores.subjectId, data.subjectId),
                eq(scores.classId, data.classId),
                eq(scores.term, data.term as any),
                eq(scores.academicYear, data.academicYear)
            ),
        });

        if (existing) {
            await db.update(scores).set({
                ca1: entry.ca1.toString(), ca2: entry.ca2.toString(),
              
                total: total.toString(), grade, remark,
                recordedById: data.teacherId, updatedAt: new Date(),
            }).where(eq(scores.id, existing.id));
        } else {
            await db.insert(scores).values({
                studentId: entry.studentId,
                subjectId: data.subjectId,
                classId: data.classId,
                term: data.term as any,
                academicYear: data.academicYear,
                ca1: entry.ca1.toString(), ca2: entry.ca2.toString(),
              
                total: total.toString(), grade, remark,
                recordedById: data.teacherId,
            });
        }
    }

    revalidatePath("/teacher/scores");
    return { success: true };
}

//Generate/Compute Full Term Result for student 

export async function computeStudentResultAction(
    studentId: string, classId: string, term: string, academicYear: string, teacherRemark: string
) {
    await requireAuth(["teacher", "admin"]);

    // Get all scores for this student this term
    const studentScores = await db.query.scores.findMany({
        where: and(
            eq(scores.studentId, studentId),
            eq(scores.classId, classId),
            eq(scores.term, term as any),
            eq(scores.academicYear, academicYear)
        ),
    });

    if (!studentScores.length) return { error: "No scores found for this student" };

    const totalScore = studentScores.reduce((sum, s) => sum + parseFloat(s.total ?? "0"), 0);
    const averageScore = totalScore / studentScores.length;

    // Upsert result
    const existing = await db.query.results.findFirst({
        where: and(
            eq(results.studentId, studentId),
            eq(results.classId, classId),
            eq(results.term, term as any),
            eq(results.academicYear, academicYear)
        ),
    });

    if (existing) {
        await db.update(results).set({
            totalScore: totalScore.toString(),
            averageScore: averageScore.toFixed(2),
            teacherRemark,
        }).where(eq(results.id, existing.id));
    } else {
        await db.insert(results).values({
            studentId, classId, term: term as any, academicYear,
            totalScore: totalScore.toString(),
            averageScore: averageScore.toFixed(2),
            teacherRemark,
        });
    }

    revalidatePath("/teacher/results");
    return { success: true };
}

//Get class scores for a subject 

export async function getClassSubjectScores(
    classId: string, subjectId: string, term: string, academicYear: string
) {
    return db.query.scores.findMany({
        where: and(
            eq(scores.classId, classId),
            eq(scores.subjectId, subjectId),
            eq(scores.term, term as any),
            eq(scores.academicYear, academicYear)
        ),
        with: { student: true, subject: true },
    });
}

//Get student full result for printing 

export async function getStudentFullResult(
    studentId: string, classId: string, term: string, academicYear: string
) {
    const studentScores = await db.query.scores.findMany({
        where: and(
            eq(scores.studentId, studentId),
            eq(scores.classId, classId),
            eq(scores.term, term as any),
            eq(scores.academicYear, academicYear)
        ),
        with: { subject: true },
    });

    const result = await db.query.results.findFirst({
        where: and(
            eq(results.studentId, studentId),
            eq(results.classId, classId),
            eq(results.term, term as any),
            eq(results.academicYear, academicYear)
        ),
    });

    const studentProfile = await db.query.students.findFirst({
        where: eq(students.userId, studentId),
        with: { user: true, class: true },
    });

    return { scores: studentScores, result, studentProfile };
}