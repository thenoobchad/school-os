import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function requireAuth(allowedRoles?: string[]) {
    
    const session = await getSession();

    if (!session) redirect("/auth")
    
    if (allowedRoles && !allowedRoles.includes(session.role)) {
        redirect(`/${session.role}`)
    }

    return session;
}