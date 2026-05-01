"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupData } from "./SignupStepper";

type Props = { data: SignupData; setData: (fn: (prev: SignupData) => SignupData) => void; onNext: () => void; onBack: () => void; onError: (msg: string) => void };

export default function StepIdentity({ data, setData, onNext, onBack, onError }: Props) {
    const handleNext = (e: any) => {
        e.preventDefault();
        if (!data.firstName || !data.lastName) return onError("First and last name are required.");
        onError("");
        onNext();
    };

    return (
        <>
            <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">Who are you?</h2>
            <p className="mb-8 text-sm leading-relaxed text-white/40">Tell us your name so students know who's teaching them.</p>
            <form onSubmit={handleNext} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-white/50">First name</Label>
                    <Input type="text" placeholder="Felix" value={data.firstName} onChange={(e) => setData((prev) => ({ ...prev, firstName: e.target.value }))} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-white/50">Last name</Label>
                    <Input type="text" placeholder="Warano" value={data.lastName} onChange={(e) => setData((prev) => ({ ...prev, lastName: e.target.value }))} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                </div>
                <div className="mt-2 flex gap-3">
                    <Button type="button" onClick={onBack} className="flex-1 cursor-pointer border border-white/10 bg-transparent py-6 text-sm font-semibold text-white hover:bg-white/5 transition-all">Back</Button>
                    <Button type="submit" className="flex-1 cursor-pointer py-6 bg-white text-sm font-bold text-neutral-950 hover:bg-neutral-200 transition-all hover:-translate-y-0.5">Continue</Button>
                </div>
            </form>
        </>
    );
}