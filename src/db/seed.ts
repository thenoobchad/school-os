"use server"

import bcrypt from "bcryptjs";
import { db } from ".";
import { classes, students, subjects, teachers, users } from "./schema";
import { config } from "dotenv"

config({ path: ".env.local" });

async function seed() {
    console.log("Seeding database...")
    console.log(process.env.DATABASE_URL!)
    //Admin
    const adminHash = (await bcrypt.hash("admin123", 12)).toString();

    await db.insert(users).values({
        firstName: "Super",
        lastName: "Admin",
        email: "admin@school.edu",
        passwordHash: adminHash,
        role: "admin",
    }).returning()

    //Teacher
    const teacherHash = await bcrypt.hash("teacher123", 12);
    const [teacher] = await db.insert(users).values({
        firstName: "John",
        lastName: "Okafor",
        email: "teacher@school.edu",
        passwordHash: teacherHash,
        role: "teacher",
    }).returning();

    await db.insert(teachers).values({
        userId: teacher.id,
        staffId: "TCH001",
        qualification: "B.Ed Mathematics",
    });

    // Student
    const studentHash = await bcrypt.hash("student123", 12);
    const [student] = await db.insert(users).values({
        firstName: "Amara",
        lastName: "Nwosu",
        email: "student@school.edu",
        passwordHash: studentHash,
        role: "student",
    }).returning();

    // Class
    const [cls] = await db.insert(classes).values({
        name: "JSS1A",
        gradeLevel: "JSS1",
        academicYear: "2024/2025",
        teacherId: teacher.id,
    }).returning();

    // Student profile
    await db.insert(students).values({
        userId: student.id,
        classId: cls.id,
        admissionNumber: "SCH/2024/001",
        guardianName: "Mr. Chukwu Nwosu",
        guardianPhone: "08012345678",
    });

    // Subjects
    await db.insert(subjects).values([
        { name: "Mathematics", code: "MTH101" },
        { name: "English Language", code: "ENG101" },
        { name: "Basic Science", code: "BSC101" },
        { name: "Social Studies", code: "SST101" },
        { name: "Computer Studies", code: "CST101" },
        { name: "Civic Education", code: "CIV101" },
    ]);


    console.log(" Seeding complete!");
    console.log("Accounts:");
    console.log("  admin@school.edu / admin123");
    console.log("  teacher@school.edu / teacher123");
    console.log("  student@school.edu / student123");
    process.exit(0);


}

seed().catch((e) => { console.error(e); process.exit(1); });