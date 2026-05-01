"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupData } from "./SignupStepper";

type Props = { data: SignupData; setData: (fn: (prev: SignupData) => SignupData) => void; onNext: () => void; onError: (msg: string) => void };

export default function StepEmail({ data, setData, onNext, onError }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const handleNext = (e: any) => {
        e.preventDefault();
        if (!data.email || !data.password) return onError("Email and password are required.");
        onError("");
        onNext();
    };

    return (
        <>
            <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">Create an account</h2>
            <p className="mb-8 text-sm leading-relaxed text-white/40">Start by entering your email and choosing a password.</p>
            <form onSubmit={handleNext} className="flex flex-col gap-5">
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
                <Button type="submit" className="mt-2 w-full cursor-pointer py-6 bg-white text-sm font-bold text-neutral-950 hover:bg-neutral-200 transition-all hover:-translate-y-0.5">Continue</Button>
            </form>
        </>
    );
}