"use client";

import { FormEvent} from "react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GraduationCap } from "lucide-react";

import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.actions";

export default function LoginPage() {
    const router = useRouter()
  
    const pending = false;
    const state = { error: "" }
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
        
            const formData = new FormData(e.currentTarget)
            const res = await loginAction(formData)
            if (res.error) {
               console.log(res.error)
            } else {
                router.push("/admin")
            }
    } catch (error) {
        console.log(error)
    }

    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-16 h-16 bg-white/10 rounded-2xl items-center justify-center mb-4 backdrop-blur">
                        <GraduationCap size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">EduManage</h1>
                    <p className="text-blue-200 mt-1">School Management System</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Sign In</h2>
                    <p className="text-sm text-gray-500 mb-6">Enter your credentials to continue</p>

                    {state?.error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            id="email" name="email" type="email"
                            label="Email Address" placeholder="you@school.edu"
                            required autoComplete="email"
                        />
                        <Input
                            id="password" name="password" type="password"
                            label="Password" placeholder="••••••••"
                            required autoComplete="current-password"
                        />
                        <Button type="submit" loading={pending} className="w-full" size="lg">
                            {pending ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-6 pt-4 border-t text-xs text-gray-400 space-y-1">
                        <p className="font-medium text-gray-500">Demo Accounts:</p>
                        <p>admin@school.edu / admin123</p>
                        <p>teacher@school.edu / teacher123</p>
                        <p>student@school.edu / student123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}