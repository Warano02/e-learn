"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Briefcase, TrendingUp, BookOpen, Laptop, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

type LearningGoal = "job" | "improve_skills" | "exam" | "freelance" | "curiosity"

const goalOptions: { value: LearningGoal; label: string; description: string; icon: React.ReactNode }[] = [
    { value: "job", label: "Get a job", description: "Prepare for a new role or career switch", icon: <Briefcase className="w-5 h-5" /> },
    { value: "improve_skills", label: "Improve my skills", description: "Level up in my current field", icon: <TrendingUp className="w-5 h-5" /> },
    { value: "exam", label: "Pass an exam", description: "Study for a certification or academic test", icon: <BookOpen className="w-5 h-5" /> },
    { value: "freelance", label: "Go freelance", description: "Build skills to work independently", icon: <Laptop className="w-5 h-5" /> },
    { value: "curiosity", label: "Just curious", description: "Explore topics I'm passionate about", icon: <Sparkles className="w-5 h-5" /> },
]

export default function OnboardingStep3Page() {
    const [goal, setGoal] = useState<LearningGoal | null>(null)
    const router = useRouter()
    const handleContinue = async () => {
        router.replace("/user")
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-start justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black pointer-events-none" />
            <div className="relative z-10 w-full max-w-2xl mx-auto">
                <div className="w-9 h-9 rounded-xl bg-gray-700 animate-pulse mb-8" />
                <h1 className="text-white text-3xl font-bold mb-1">What's your main learning goal?</h1>
                <p className="text-zinc-400 text-sm mb-10">We'll tailor your experience based on what you want to achieve.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                    {goalOptions.map((opt) => (
                        <button key={opt.value} onClick={() => setGoal(opt.value)} className={cn("flex items-start gap-4 p-5 rounded-xl border text-left transition-all duration-150 cursor-pointer", goal === opt.value ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white")} >
                            <span className={cn("mt-0.5 shrink-0", goal === opt.value ? "text-black" : "text-zinc-400")}>{opt.icon}</span>
                            <div>
                                <p className="font-semibold text-sm mb-0.5">{opt.label}</p>
                                <p className={cn("text-xs", goal === opt.value ? "text-zinc-600" : "text-zinc-500")}>{opt.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={handleContinue} disabled={!goal} className="bg-white text-black font-semibold px-7 py-5 rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm cursor-pointer">
                        Finish setup
                    </Button>
                </div>
            </div>
        </div>
    )
}