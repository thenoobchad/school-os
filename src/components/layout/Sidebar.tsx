"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, Users, BookOpen, School, ClipboardList,
    BarChart2, CheckSquare, FileText, LogOut, GraduationCap,
} from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { FormEvent } from "react";



interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const adminNav: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/users", label: "Users", icon: <Users size={18} /> },
    { href: "/admin/classes", label: "Classes", icon: <School size={18} /> },
    { href: "/admin/subjects", label: "Subjects", icon: <BookOpen size={18} /> },
    { href: "/admin/results", label: "Results", icon: <BarChart2 size={18} /> },
];

const teacherNav: NavItem[] = [
    { href: "/teacher", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/teacher/attendance", label: "Attendance", icon: <CheckSquare size={18} /> },
    { href: "/teacher/scores", label: "Scores", icon: <ClipboardList size={18} /> },
];

const studentNav: NavItem[] = [
    { href: "/student", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/student/results", label: "My Results", icon: <FileText size={18} /> },
    { href: "/student/attendance", label: "Attendance", icon: <CheckSquare size={18} /> },
];

const navByRole: Record<string, NavItem[]> = {
    admin: adminNav,
    teacher: teacherNav,
    student: studentNav,
};

interface SidebarProps {
    role: string;
    userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
    const pathname = usePathname();
    const navItems = navByRole[role] ?? [];

    const roleColors: Record<string, string> = {
        admin: "from-blue-600 to-blue-800",
        teacher: "from-emerald-600 to-emerald-800",
        student: "from-violet-600 to-violet-800",
    };

    const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await logoutAction()
    }

    return (
        <aside className={cn(
            "w-64 min-h-screen bg-gradient-to-b text-white flex flex-col",
            roleColors[role] ?? "from-gray-700 to-gray-900"
        )}>
            {/* Brand */}
            <div className="px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                        <GraduationCap size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-lg leading-tight">EduManage</p>
                        <p className="text-xs text-white/60 capitalize">{role} Portal</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const active = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                active
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Logout */}
            <div className="px-4 py-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3 px-1">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{userName}</p>
                        <p className="text-xs text-white/50 capitalize">{role}</p>
                    </div>
                </div>
                <form onSubmit={handleLogout}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </form>
            </div>
        </aside>
    );
}