"use server"

import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, deleteSession } from "@/lib/session";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" };
    }



    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()))

    if (!user) return { error: "Invalid credentials" }

    
    if (!user.isActive) return {
        error: "Account is inactive. Contact admin."
    }

    const valid = await bcrypt.compare(password, user.passwordHash)

    if (!valid) return { error: "Invalid credentials" };

    await createSession({
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
    })

    redirect(`/${user.role}`)

}

export async function logoutAction() {
    await deleteSession();
    redirect("/auth");
}