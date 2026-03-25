import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    pgEnum,
    integer,
    boolean,
    date,
    decimal,
    primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

//Enums
export const roleEnum = pgEnum("role", ["admin", "teacher", "student"])

export const termEnum = pgEnum("term", ["first", "second", "third"])

export const gradeEnum = pgEnum("grade_level", ["JSS1", "JSS2", "JSS3"])

export const attendanceEnum = pgEnum("attendance_status", ["present", "absent"])

//Users

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("student"),
    phone: varchar("phone", { length: 20 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

//Classes
export const classes = pgTable("classes", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),        // e.g. "JSS1A"
    gradeLevel: gradeEnum("grade_level").notNull(),
    academicYear: varchar("academic_year", { length: 20 }).notNull(), // e.g. "2024/2025"
    teacherId: uuid("teacher_id").references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});


//Students
export const students = pgTable("students", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    classId: uuid("class_id").references(() => classes.id),
    admissionNumber: varchar("admission_number", { length: 50 }).unique(),
    dateOfBirth: date("date_of_birth"),
    guardianName: varchar("guardian_name", { length: 200 }),
    guardianPhone: varchar("guardian_phone", { length: 20 }),
    address: text("address"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

//Teachers
export const teachers = pgTable("teachers", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    staffId: varchar("staff_id", { length: 50 }).unique(),
    qualification: varchar("qualification", { length: 200 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

//Subjects
export const subjects = pgTable("subjects", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});


//Class Subject
export const classSubjects = pgTable("class_subjects", {
    id: uuid("id").primaryKey().defaultRandom(),
    classId: uuid("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id").references(() => users.id),
});

//Attendance
export const attendance = pgTable("attendance", {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    classId: uuid("class_id").notNull().references(() => classes.id),
    date: date("date").notNull(),
    status: attendanceEnum("status").notNull().default("present"),
    markedById: uuid("marked_by_id").references(() => users.id),
    remark: text("remark"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

//Scores
export const scores = pgTable("scores", {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id").notNull().references(() => subjects.id),
    classId: uuid("class_id").notNull().references(() => classes.id),
    term: termEnum("term").notNull(),
    academicYear: varchar("academic_year", { length: 20 }).notNull(),
    // CA scores
    ca1: decimal("ca1", { precision: 5, scale: 2 }).default("0"),
    ca2: decimal("ca2", { precision: 5, scale: 2 }).default("0"),

    exam: decimal("exam", { precision: 5, scale: 2 }).default("0"),
    // Computed
    total: decimal("total", { precision: 5, scale: 2 }).default("0"),
    grade: varchar("grade", { length: 5 }),
    remark: varchar("remark", { length: 50 }),
    recordedById: uuid("recorded_by_id").references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


//Results
export const results = pgTable("results", {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    classId: uuid("class_id").notNull().references(() => classes.id),
    term: termEnum("term").notNull(),
    academicYear: varchar("academic_year", { length: 20 }).notNull(),
    totalScore: decimal("total_score", { precision: 6, scale: 2 }),
    averageScore: decimal("average_score", { precision: 5, scale: 2 }),
    position: integer("position"),
    teacherRemark: text("teacher_remark"),
    principalRemark: text("principal_remark"),
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});


//Relations
export const usersRelations = relations(users, ({ one, many }) => ({
    studentProfile: one(students, {
        fields: [users.id],
        references: [students.userId],
    }),
    teacherProfile: one(teachers, {
        fields: [users.id],
        references: [teachers.userId],
    }),
    attendance: many(attendance),
    scores: many(scores),
    results: many(results),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
    teacher: one(users, { fields: [classes.teacherId], references: [users.id] }),
    students: many(students),
    classSubjects: many(classSubjects),
    attendance: many(attendance),
    scores: many(scores),
    results: many(results),
}));

export const studentProfilesRelations = relations(students, ({ one }) => ({
    user: one(users, { fields: [students.userId], references: [users.id] }),
    class: one(classes, { fields: [students.classId], references: [classes.id] }),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
    classSubjects: many(classSubjects),
    scores: many(scores),
}));

export const scoresRelations = relations(scores, ({ one }) => ({
    student: one(users, { fields: [scores.studentId], references: [users.id] }),
    subject: one(subjects, { fields: [scores.subjectId], references: [subjects.id] }),
    class: one(classes, { fields: [scores.classId], references: [classes.id] }),
}));

export const resultsRelations = relations(results, ({ one }) => ({
    student: one(users, { fields: [results.studentId], references: [users.id] }),
    class: one(classes, { fields: [results.classId], references: [classes.id] }),
}));

//Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Score = typeof scores.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type Result = typeof results.$inferSelect;
export type StudentProfile = typeof students.$inferSelect;