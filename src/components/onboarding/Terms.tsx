"use client"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

function Terms() {
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [emailSubscribed, setEmailSubscribed] = useState(false)
    const router = useRouter()

    const verifyAccount = async () => {
        // before that, i'll sent a get request to the backend 

        router.replace("/onboarding/step-1")
    }

    return (
        <>
            <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-7 backdrop-blur-sm space-y-5">
                <div className="flex items-start gap-4">
                    <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} className="mt-0.5 border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black" />
                    <label htmlFor="terms" className="text-zinc-300 text-sm leading-relaxed cursor-pointer">
                        I agree to LearnFlow's{" "}
                        <Link target="_blank" href="/terms-of-use" className="text-white underline underline-offset-2 hover:text-zinc-200 transition-colors">Terms of Service</Link>{" "}
                        and{" "}
                        <Link target="_blank" href="/privacy-policy" className="text-white underline underline-offset-2 hover:text-zinc-200 transition-colors">Acceptable Use Policy</Link>
                        , and confirm that I am at least 13 years of age.
                    </label>
                </div>
                <div className="w-full h-px bg-zinc-800" />
                <div className="flex items-start gap-4">
                    <Checkbox id="emails" checked={emailSubscribed} onCheckedChange={(v) => setEmailSubscribed(!!v)} className="mt-0.5 border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-black" />
                    <label htmlFor="emails" className="text-zinc-300 text-sm leading-relaxed cursor-pointer">
                        Send me course recommendations, learning tips, and platform updates. You can opt out anytime.
                    </label>
                </div>
                <Button disabled={!termsAccepted} onClick={() => verifyAccount()} className="w-full mt-2 bg-white text-black font-semibold py-6 rounded-xl cursor-pointer hover:bg-zinc-100 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-sm tracking-wide">
                    Create Account
                </Button>
            </div>
            <div className="mt-8 text-center space-y-1">
                <p className="text-zinc-500 text-xs">Email verified as <span className="text-zinc-300">felix@warano.dev</span></p>
                <button className="text-zinc-400 text-xs underline underline-offset-2 hover:text-white transition-colors">
                    Use a different email
                </button>
            </div>
        </>
    )
}

export default Terms