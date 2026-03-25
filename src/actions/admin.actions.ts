"use server"

import { db } from "@/db";
import { classes, classSubjects, results, students, subjects, teachers, users } from "@/db/schema";
import { requireAuth } from "@/lib/auth"
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";



//Create User
export async function createUserAction(formData: FormData) {
    await requireAuth(["admin"])

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as "admin" | "teacher" | "student";
    const phone = formData.get("phone") as string;
    const classId = formData.get("classId") as string;
    const admissionNumber = formData.get("admissionNumber") as string;
    const staffId = formData.get("staffId") as string;
    const qualification = formData.get("qualification") as string;

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db.insert(users).values({
        firstName, lastName, email: email.toLowerCase(),
        passwordHash, role, phone,
    }).returning();

    if (role === "student") {
        await db.insert(students).values({
            userId: user.id,
            classId: classId || null,
            admissionNumber: admissionNumber || null,
        });
    }


    if (role === "teacher") {
        await db.insert(teachers).values({
            userId: user.id,
            staffId: staffId || null,
            qualification: qualification || null,
        });
    }

    revalidatePath("/admin/users");
    return { success: true, userId: user.id, error: null };
}


//Update User

export async function updateUserAction(formData: FormData) {
    await requireAuth(["admin"]);

    const id = formData.get("id") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const isActive = formData.get("isActive") === "true";

    await db.update(users).set({ firstName, lastName, phone, isActive, updatedAt: new Date() })
        .where(eq(users.id, id));

    revalidatePath("/admin/users");
    return { success: true };

}

//Toggle User Active

export async function toggleUserActiveAction(userId: string, isActive: boolean) {
    await requireAuth(["admin"]);
    await db.update(users).set({ isActive, updatedAt: new Date() }).where(eq(users.id, userId));
    revalidatePath("/admin/users");
}

//Delete User

export async function deleteUserAction(userId: string) {
    await requireAuth(["admin"]);
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/users");
}

//Create Class

export async function createClassAction(formData: FormData) {

    await requireAuth(["admin"]);

    const name = formData.get("name") as string;
    const gradeLevel = formData.get("gradeLevel") as any;
    const academicYear = formData.get("academicYear") as string;
    const teacherId = formData.get("teacherId") as string;

    await db.insert(classes).values({ name, gradeLevel, academicYear, teacherId });
    revalidatePath("/admin/classes");
    return { success: true };
}

//Create Subject

export async function createSubjectAction(formData: FormData) {
    await requireAuth(["admin"]);

    const name = formData.get("name") as string;
    const code = formData.get("code") as string;

    await db.insert(subjects).values({ name, code });
    revalidatePath("/admin/subjects");
    return { success: true };
}

//Assign Subject to Class

export async function assignSubjectToClassAction(classId: string, subjectId: string, teacherId: string) {
    await requireAuth(["admin"]);
    await db.insert(classSubjects).values({ classId, subjectId, teacherId });
    revalidatePath("/admin/classes");
}

//Publish Result

export async function publishResultAction(resultId: string) {
    await requireAuth(["admin"]);
    await db.update(results)
        .set({ isPublished: true, publishedAt: new Date() })
        .where(eq(results.id, resultId));
    revalidatePath("/admin/results");
}

//Unpublish Result

export async function unpublishResultAction(resultId: string) {
    await requireAuth(["admin"]);

    await db.update(results)
        .set({ isPublished: false, publishedAt: null })
        .where(eq(results.id, resultId));
    revalidatePath("/admin/results");
}

//Get all users

export async function getAllUsers() {
    return db.select().from(users).orderBy(users.createdAt);
}

//Get all classes
export async function getAllClasses() {
    return db.query.classes.findMany({
        with: { teacher: true },
        orderBy: (c, { asc }) => [asc(c.name)],
    });
}

// Get all subjects
export async function getAllSubjects() {
    return db.select().from(subjects).orderBy(subjects.name);
}

//Get all results

export async function getAllResults() {
    return db.query.results.findMany({
        with: { student: true, class: true },
        orderBy: (r, { desc }) => [desc(r.createdAt)],
    });
}

//Reset Password

export async function resetPasswordAction(userId: string, newPassword: string) {
    await requireAuth(["admin"]);
    
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId));
    return { success: true };
}