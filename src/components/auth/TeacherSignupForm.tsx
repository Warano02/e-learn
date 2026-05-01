"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

type Interest = {
    _id: string;
    name: string;
    slug: string;
    category: string;
};

const STEPS = ["Email", "Identity", "Topics", "Location"];

function TeacherSignupForm() {
    const { register } = useAuthStore();
    const router = useRouter();
        const [interests, setInterests] = useState<Interest[]>([])

    const [step, setStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        topics: [] as string[],
        country: "",
        city: "",
    });

    const set = (key: string, value: any) => setData((prev) => ({ ...prev, [key]: value }));

    const toggleTopic = (id: string) => {
        setData((prev) => ({
            ...prev,
            topics: prev.topics.includes(id) ? prev.topics.filter((t) => t !== id) : [...prev.topics, id],
        }));
    };

    const validate = () => {
        if (step === 0 && (!data.email || !data.password)) return "Email and password are required.";
        if (step === 1 && (!data.firstName || !data.lastName)) return "First and last name are required.";
        if (step === 2 && data.topics.length === 0) return "Please select at least one topic.";
        if (step === 3 && (!data.country || !data.city)) return "Country and city are required.";
        return "";
    };

    const next = () => {
        const err = validate();
        if (err) return setError(err);
        setError("");
        setStep((s) => s + 1);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const err = validate();
        if (err) return setError(err);
        setError("");
        setLoading(true);
        const res = await register({ ...data, role: "teacher" });
        setLoading(false);
        if (!res.success) return setError(res.msg || "Registration failed.");
        router.push("/auth/sign-success");
    };

    const grouped = interests.reduce((acc: Record<string, Interest[]>, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await axiosInstance.get("/p/tags")
                if (!res.data) throw new Error("Failed to load interests")
                const data: Interest[] = res.data?.tags || []
                setInterests(data)
            } catch {
                setError("Could not load interests. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchInterests()
    }, [])
    return (
        <div className="relative flex w-full flex-col justify-center px-8 py-12 lg:w-[520px] lg:min-w-[460px] lg:px-14">
            <div className="mb-10 flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-lg bg-white/20" />
                <span className="text-lg font-bold tracking-tight text-white">Ingenierie web</span>
            </div>

            <div className="mb-8 flex items-center gap-2">
                {STEPS.map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-all ${i < step ? "bg-white text-neutral-950" : i === step ? "border border-white text-white" : "border border-white/15 text-white/25"}`}>
                            {i < step ? <Check className="h-3 w-3" /> : i + 1}
                        </div>
                        <span className={`text-xs transition-all ${i === step ? "text-white" : "text-white/25"}`}>{label}</span>
                        {i < STEPS.length - 1 && <div className={`mx-1 h-px w-6 transition-all ${i < step ? "bg-white" : "bg-white/10"}`} />}
                    </div>
                ))}
            </div>

            {step === 0 && (
                <>
                    <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">Create an account</h2>
                    <p className="mb-8 text-sm leading-relaxed text-white/40">Start by entering your email and choosing a password.</p>
                </>
            )}
            {step === 1 && (
                <>
                    <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">Who are you?</h2>
                    <p className="mb-8 text-sm leading-relaxed text-white/40">Tell us your name so students know who's teaching them.</p>
                </>
            )}
            {step === 2 && (
                <>
                    <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">What do you teach?</h2>
                    <p className="mb-8 text-sm leading-relaxed text-white/40">Select the topics that best match your expertise.</p>
                </>
            )}
            {step === 3 && (
                <>
                    <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">Where are you based?</h2>
                    <p className="mb-8 text-sm leading-relaxed text-white/40">Your location helps us connect you with local opportunities.</p>
                </>
            )}

            {error && (
                <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}

            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); next(); }} className="flex flex-col gap-5">
                {step === 0 && (
                    <>
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium uppercase tracking-wider text-white/50">Email address</Label>
                            <Input type="email" placeholder="felix@warano.dev" value={data.email} onChange={(e) => set("email", e.target.value)} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium uppercase tracking-wider text-white/50">Password</Label>
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} placeholder="••••••••••" value={data.password} onChange={(e) => set("password", e.target.value)} className="border-white/10 bg-white/5 pr-11 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/30 transition-colors hover:text-white/60">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {step === 1 && (
                    <>
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium uppercase tracking-wider text-white/50">First name</Label>
                            <Input type="text" placeholder="Felix" value={data.firstName} onChange={(e) => set("firstName", e.target.value)} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium uppercase tracking-wider text-white/50">Last name</Label>
                            <Input type="text" placeholder="Warano" value={data.lastName} onChange={(e) => set("lastName", e.target.value)} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                        </div>
                    </>
                )}

                {step === 2 && (
                    <div className="flex max-h-72 flex-col gap-6 overflow-y-auto pr-1">
                        {Object.entries(grouped).map(([category, items]) => (
                            <div key={category} className="flex flex-col gap-3">
                                <span className="text-xs font-medium uppercase tracking-wider text-white/30">{category}</span>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((topic) => {
                                        const selected = data.topics.includes(topic._id);
                                        return (
                                            <button key={topic._id} type="button" onClick={() => toggleTopic(topic._id)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${selected ? "border-white bg-white text-neutral-950" : "border-white/10 bg-white/5 text-white/50 hover:border-white/25 hover:text-white"}`}>
                                                {topic.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {step === 3 && (
                    <>
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium uppercase tracking-wider text-white/50">Country</Label>
                            <Input type="text" placeholder="Cameroon" value={data.country} onChange={(e) => set("country", e.target.value)} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-xs font-medium uppercase tracking-wider text-white/50">City</Label>
                            <Input type="text" placeholder="Yaoundé" value={data.city} onChange={(e) => set("city", e.target.value)} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                        </div>
                    </>
                )}

                <div className="mt-2 flex gap-3">
                    {step > 0 && (
                        <Button type="button" onClick={() => { setError(""); setStep((s) => s - 1); }} className="cursor-pointer flex-1 border border-white/10 bg-transparent py-6 text-sm font-semibold text-white hover:bg-white/5 transition-all">
                            Back
                        </Button>
                    )}
                    <Button type="submit" disabled={loading} className="flex-1 cursor-pointer py-6 bg-white text-sm font-bold text-neutral-950 hover:bg-neutral-200 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,255,255,0.12)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                        {step === 3 ? (loading ? "Submitting..." : "Create account") : "Continue"}
                    </Button>
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-white/35">
                Already have an account?{" "}
                <a href="/auth/teacher/login" className="cursor-pointer font-semibold text-white/75 transition-colors hover:text-white">Sign in</a>
            </p>
        </div>
    );
}

export default TeacherSignupForm;