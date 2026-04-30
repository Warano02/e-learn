
import SignupForm from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign up - IW",
    description: "Create your free account and start learning today. Join thousands of learners already growing their skills on E-Learn.",
};

export default function SignupPage() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-neutral-950">
            <SignupForm />

            <div className="relative hidden lg:flex flex-1 flex-col justify-end p-14 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80')" }} />
                <div className="absolute inset-0 bg-gradient-to-bl from-black/85 via-black/50 to-black/75" />
                <div className="relative z-10 flex flex-col gap-6">
                    <p className="max-w-md text-2xl font-light leading-relaxed text-white">
                        Join a community of passionate learners and take your skills to the next level.
                    </p>
                    <div className="mt-6 flex items-center gap-8">
                        {[["12K+", "Courses"], ["320K", "Learners"], ["98%", "Satisfaction"]].map(([num, label], i) => (
                            <div key={i} className="flex items-center gap-8">
                                {i > 0 && <div className="h-8 w-px bg-white/10" />}
                                <div className="flex flex-col gap-1">
                                    <span className="text-xl font-bold text-white">{num}</span>
                                    <span className="text-xs uppercase tracking-widest text-white/40">{label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}