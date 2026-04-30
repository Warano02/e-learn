
import Terms from "@/components/onboarding/Terms"
import { Metadata } from "next"
export const metadata: Metadata = {
    title: "Onboarding -  IW",
    description: "Let's set up your account - IW"
}

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center w-full max-w-md">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-9 h-9 rounded-xl bg-gray-700 animate-pulse" />
                    <span className="text-white text-xl font-semibold tracking-tight" >Ingenieur</span>
                </div>
                <div className="text-center mb-10">
                    <h1 className="text-white text-4xl font-bold mb-3 leading-tight">
                        Let's set up your account
                    </h1>
                    <p className="text-zinc-400 text-sm tracking-wide">A few things to review before you start learning</p>
                </div>
                <Terms />
                
            </div>
        </div>
    )
}