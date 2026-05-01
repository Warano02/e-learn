"use client";
import { Button } from "@/components/ui/button";
import { SignupData } from "./SignupStepper";

type Interest = { _id: string; name: string; slug: string; category: string };
type Props = { data: SignupData; setData: (fn: (prev: SignupData) => SignupData) => void; interests: Interest[]; onNext: () => void; onBack: () => void; onError: (msg: string) => void };

export default function StepTopics({ data, setData, interests, onNext, onBack, onError }: Props) {
    const toggle = (id: string) => setData((prev) => ({ ...prev, topics: prev.topics.includes(id) ? prev.topics.filter((t) => t !== id) : [...prev.topics, id] }));

    const handleNext = (e: any) => {
        e.preventDefault();
        if (data.topics.length === 0) return onError("Please select at least one topic.");
        onError("");
        onNext();
    };

    const grouped = interests.reduce((acc: Record<string, Interest[]>, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <>
            <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">What do you teach?</h2>
            <p className="mb-8 text-sm leading-relaxed text-white/40">Select the topics that best match your expertise.</p>
            <form onSubmit={handleNext} className="flex flex-col gap-5">
                <div className="flex max-h-64 flex-col gap-5 overflow-y-auto pr-1">
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category} className="flex flex-col gap-3">
                            <span className="text-xs font-medium uppercase tracking-wider text-white/30">{category}</span>
                            <div className="flex flex-wrap gap-2">
                                {items.map((topic) => {
                                    const selected = data.topics.includes(topic._id);
                                    return (
                                        <button key={topic._id} type="button" onClick={() => toggle(topic._id)} className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${selected ? "border-white bg-white text-neutral-950" : "border-white/10 bg-white/5 text-white/50 hover:border-white/25 hover:text-white"}`}>
                                            {topic.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-2 flex gap-3">
                    <Button type="button" onClick={onBack} className="flex-1 cursor-pointer border border-white/10 bg-transparent py-6 text-sm font-semibold text-white hover:bg-white/5 transition-all">Back</Button>
                    <Button type="submit" className="flex-1 cursor-pointer py-6 bg-white text-sm font-bold text-neutral-950 hover:bg-neutral-200 transition-all hover:-translate-y-0.5">Continue</Button>
                </div>
            </form>
        </>
    );
}