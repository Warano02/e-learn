"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { GraduationCap, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

type EducationLevel = "none" | "primary" | "middle_school" | "high_school" | "technical_vocational" | "bachelor" | "master" | "phd" | "other"
type SkillLevel = "beginner" | "intermediate" | "advanced"

type Payload = {
    level: EducationLevel | null
    skill: SkillLevel | null
}

const educationOptions: { value: EducationLevel; label: string; description: string }[] = [
    { value: "none", label: "No formal education", description: "Self-taught or no diploma" },
    { value: "primary", label: "Primary school", description: "Elementary level" },
    { value: "middle_school", label: "Middle school", description: "Junior high level" },
    { value: "high_school", label: "High school", description: "Secondary diploma" },
    { value: "technical_vocational", label: "Technical / Vocational", description: "Trade or vocational certificate" },
    { value: "bachelor", label: "Bachelor's degree", description: "Undergraduate" },
    { value: "master", label: "Master's degree", description: "Postgraduate" },
    { value: "phd", label: "PhD / Doctorate", description: "Doctoral level" },
    { value: "other", label: "Other", description: "Something else" },
]

const skillOptions: { value: SkillLevel; label: string; description: string; color: string }[] = [
    { value: "beginner", label: "Beginner", description: "Little to no prior experience", color: "emerald" },
    { value: "intermediate", label: "Intermediate", description: "Some hands-on experience", color: "blue" },
    { value: "advanced", label: "Advanced", description: "Solid knowledge, ready to go deep", color: "violet" },
]

export default function OnboardingStep2Page() {
    const [level, setLevel] = useState<EducationLevel | null>(null)
    const [skill, setSkill] = useState<SkillLevel | null>(null)

    const isValid = level !== null && skill !== null

    const payload: Payload = { level, skill }
 
    const router=useRouter()
    const handleContinue = async () => {
       router.replace("/onboarding/step-3")
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-start justify-center px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black pointer-events-none" />
            <div className="relative z-10 w-full max-w-2xl mx-auto">
                <div className="w-9 h-9 rounded-xl bg-gray-700 animate-pulse mb-8" />
                <h1 className="text-white text-3xl font-bold mb-1" >
                    Tell us about your background
                </h1>
                <p className="text-zinc-400 text-sm mb-10">This helps us match you with the right courses and difficulty levels.</p>
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-white text-sm font-semibold tracking-wide uppercase">Education level</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {educationOptions.map((opt) => (
                            <button key={opt.value} onClick={() => setLevel(opt.value)} className={cn("px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-150 text-left cursor-pointer", level === opt.value ? "bg-white text-black border-white": "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white")}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {level && (
                        <p className="mt-3 text-zinc-500 text-xs">
                            {educationOptions.find((o) => o.value === level)?.description}
                        </p>
                    )}
                </div>
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-white text-sm font-semibold tracking-wide uppercase">Your current skill level</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {skillOptions.map((opt) => (
                            <button key={opt.value}  onClick={() => setSkill(opt.value)}  className={cn("p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer", skill === opt.value? "bg-white text-black border-white": "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white" )} >
                                <p className="font-semibold text-sm mb-1">{opt.label}</p>
                                <p className={cn("text-xs", skill === opt.value ? "text-zinc-500" : "text-zinc-500")}>
                                    {opt.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button  onClick={handleContinue}  disabled={!isValid} className="bg-white text-black font-semibold px-7 py-5 rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm cursor-pointer">
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}