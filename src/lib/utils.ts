import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function computeGrade(total: number): { grade: string; remark: string } {
    if (total >= 70) return { grade: "A", remark: "Excellent" };
    if (total >= 60) return { grade: "B", remark: "Very Good" };
    if (total >= 50) return { grade: "C", remark: "Good" };
    if (total >= 45) return { grade: "D", remark: "Pass" };
    if (total >= 40) return { grade: "E", remark: "Fair" };
    return { grade: "F", remark: "Fail" };
}

export function fullName(firstName: string, lastName: string) {
    return `${firstName} ${lastName}`;
}