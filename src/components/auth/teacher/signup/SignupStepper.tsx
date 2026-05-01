"use client";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import StepEmail from "./StepEmail";
import StepIdentity from "./StepIdentity";
import StepTopics from "./StepTopics";
import StepLocation from "./StepLocation";

type Interest = { _id: string; name: string; slug: string; category: string };

export type SignupData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    topics: string[];
    country: string;
    city: string;
};

const STEPS = ["Email", "Identity", "Topics", "Location"];

export default function SignupStepper({ interests }: { interests: Interest[] }) {
    const { register } = useAuthStore();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SignupData>({ email: "", password: "", firstName: "", lastName: "", topics: [], country: "", city: "" });

    const next = () => { setError(""); setStep((s) => s + 1); };
    const back = () => { setError(""); setStep((s) => s - 1); };

    const handleSubmit = async () => {
        setError("");
        setLoading(true);
        const res = await register({ ...data, role: "teacher" });
        setLoading(false);
        if (!res.success) return setError(res.msg || "Registration failed.");
        router.push("/auth/sign-success");
    };

    return (
        <div className="relative flex w-full flex-col justify-center px-8 py-12 lg:w-[520px] lg:min-w-[460px] lg:px-14">
            <div className="mb-10 flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-white/20" />
                <span className="text-lg font-bold tracking-tight text-white">Ingenierie web</span>
            </div>

            <div className="mb-8 flex items-center">
                {STEPS.map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all ${i < step ? "bg-white text-neutral-950" : i === step ? "border border-white text-white" : "border border-white/15 text-white/25"}`}>
                            {i < step ? "✓" : i + 1}
                        </div>
                        <span className={`text-xs transition-all ${i === step ? "text-white" : "text-white/25"}`}>{label}</span>
                        {i < STEPS.length - 1 && <div className={`mx-3 h-px w-6 transition-all ${i < step ? "bg-white" : "bg-white/10"}`} />}
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            {step === 0 && <StepEmail data={data} setData={setData} onNext={next} onError={setError} />}
            {step === 1 && <StepIdentity data={data} setData={setData} onNext={next} onBack={back} onError={setError} />}
            {step === 2 && <StepTopics data={data} setData={setData} interests={interests} onNext={next} onBack={back} onError={setError} />}
            {step === 3 && <StepLocation data={data} setData={setData} onBack={back} onError={setError} onSubmit={handleSubmit} loading={loading} />}

            <p className="mt-6 text-center text-sm text-white/35">
                Already have an account?{" "}
                <a href="/auth/teacher/login" className="cursor-pointer font-semibold text-white/75 transition-colors hover:text-white">Sign in</a>
            </p>
        </div>
    );
}