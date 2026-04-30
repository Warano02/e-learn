import { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Check your inbox - IW",
    description: "A confirmation email has been sent to your address.",
};

export default function SignSuccessPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-neutral-100 px-6 dark:bg-neutral-950">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-10 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 dark:bg-white/10">
                    <Mail className="h-5 w-5 text-neutral-800 dark:text-white" />
                </div>
                <h1 className="mb-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Check your inbox</h1>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-white/40">
                    We sent a confirmation link to your email. Open it to activate your account.
                </p>
                <div className="my-8 h-px w-full bg-neutral-200 dark:bg-white/[0.08]" />
                <p className="text-xs text-neutral-400 dark:text-white/25">
                    Didn't receive anything?{" "}
                    <a href="/auth/register" className="cursor-pointer text-neutral-600 underline underline-offset-4 transition-colors hover:text-neutral-900 dark:text-white/50 dark:hover:text-white">
                        Try again
                    </a>
                </p>
            </div>
        </div>
    );
}