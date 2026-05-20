"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import GoogleButton from "./user/GoogleButton";
import LinkedinButton from "./user/LinkedinButton";

function TeacherLoginForm() {
    const { login } = useAuthStore();
    const router = useRouter();
    const [data, setData] = useState({ email: "", password: "", stayConnected: false });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        if (!data.email || !data.password) return setError("All fields are required.");
        setLoading(true);
        const res = await login({ ...data, role: "teacher" });
        console.log(res)
        setLoading(false);
        if (!res.success) return setError(res.msg || "Login failed.");

        router.push("/admin");
    };

    return (
        <div className="relative flex w-full flex-col justify-center px-8 py-12 lg:w-120 lg:min-w-105 lg:px-14">
            <div className="mb-12 flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-white/20" />
                <span className="text-lg font-bold tracking-tight text-white">Ingenierie web</span>
            </div>
            <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="mb-9 text-sm leading-relaxed text-white/40">Sign in to manage your courses and students.</p>
            <div className="mb-7 flex gap-3">
                <GoogleButton />
                <LinkedinButton />
            </div>
            <div className="mb-7 flex items-center gap-3">
                <Separator className="flex-1 bg-white/8" />
                <span className="text-xs uppercase tracking-widest text-white/25">or</span>
                <Separator className="flex-1 bg-white/8" />
            </div>
            {error && (
                <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-white/50">Email address</Label>
                    <Input type="email" placeholder="felix@warano.dev" value={data.email} onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-white/50">Password</Label>
                    <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••••" value={data.password} onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))} className="border-white/10 bg-white/5 pr-11 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/30 transition-colors hover:text-white/60">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <Checkbox id="stay" checked={data.stayConnected} onCheckedChange={(value) => setData((prev) => ({ ...prev, stayConnected: !!value }))} className="cursor-pointer border-white/20 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-neutral-950" />
                        <Label htmlFor="stay" className="cursor-pointer text-sm text-white/45">Stay connected</Label>
                    </div>
                    <a href="/auth/forgot-password" className="cursor-pointer text-sm text-white/40 transition-colors hover:text-white">Forgot password?</a>
                </div>
                <Button type="submit" disabled={loading} className="mt-2 w-full cursor-pointer py-6 bg-white text-sm font-bold text-neutral-950 hover:bg-neutral-200 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.12)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                    {loading ? "Signing in..." : "Sign in"}
                </Button>
            </form>
            <p className="mt-6 text-center text-sm text-white/35">
                Not a teacher?{" "}
                <a href="/auth/login" className="cursor-pointer font-semibold text-white/75 transition-colors hover:text-white">Student login</a>
            </p>
        </div>
    );
}

export default TeacherLoginForm;