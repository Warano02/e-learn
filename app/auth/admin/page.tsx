import { Metadata } from "next";
import TeacherLoginForm from "@/components/auth/TeacherLoginForm";

export const metadata: Metadata = {
    title: "Teacher Login - IW",
    description: "Sign in to your teacher dashboard to manage your courses and students.",
};

export default function TeacherLoginPage() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-neutral-950">
            <TeacherLoginForm />
            <div className="relative hidden lg:flex flex-1 flex-col justify-end p-14 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80')" }} />
                <div className="absolute inset-0 bg-gradient-to-bl from-black/85 via-black/50 to-black/75" />
                <div className="relative z-10 flex flex-col gap-6">
                    <p className="max-w-md text-2xl font-light leading-relaxed text-white">Share your knowledge and shape the next generation of professionals.</p>
                    <div className="mt-6 flex items-center gap-8">
                        {[["1.2K+", "Teachers"], ["320K", "Students"], ["12K+", "Courses"]].map(([num, label], i) => (
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