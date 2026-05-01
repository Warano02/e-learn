"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupData } from "./SignupStepper";

type Props = { data: SignupData; setData: (fn: (prev: SignupData) => SignupData) => void; onBack: () => void; onError: (msg: string) => void; onSubmit: () => void; loading: boolean };

type NominatimResult = { place_id: number; display_name: string; address: { city?: string; town?: string; village?: string; country?: string; state?: string } };

export default function StepLocation({ data, setData, onBack, onError, onSubmit, loading }: Props) {
    const [query, setQuery] = useState(data.city ? `${data.city}, ${data.country}` : "");
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [open, setOpen] = useState(false);
    const [fetching, setFetching] = useState(false);
    const debounce = useRef<NodeJS.Timeout>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const search = (value: string) => {
        setQuery(value);
        setData((prev) => ({ ...prev, city: "", country: "" }));
        clearTimeout(debounce.current);
        if (value.length < 2) { setResults([]); setOpen(false); return; }
        debounce.current = setTimeout(async () => {
            setFetching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=6&featuretype=city`, { headers: { "Accept-Language": "en" } });
                const json: NominatimResult[] = await res.json();
                setResults(json);
                setOpen(json.length > 0);
            } catch { setResults([]); }
            setFetching(false);
        }, 400);
    };

    const select = (result: NominatimResult) => {
        const city = result.address.city || result.address.town || result.address.village || "";
        const country = result.address.country || "";
        setQuery(`${city}, ${country}`);
        setData((prev) => ({ ...prev, city, country }));
        setResults([]);
        setOpen(false);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!data.city || !data.country) return onError("Please select a location from the list.");
        onError("");
        onSubmit();
    };

    return (
        <>
            <h2 className="mb-1 text-3xl font-bold tracking-tight text-white">Where are you based?</h2>
            <p className="mb-8 text-sm leading-relaxed text-white/40">Your location helps us connect you with local opportunities.</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2" ref={containerRef}>
                    <Label className="text-xs font-medium uppercase tracking-wider text-white/50">City, Country</Label>
                    <div className="relative">
                        <Input type="text" placeholder="Yaoundé, Cameroon" value={query} onChange={(e) => search(e.target.value)} onFocus={() => results.length > 0 && setOpen(true)} className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus-visible:border-white/35 focus-visible:ring-0 transition-all" />
                        {fetching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">...</span>}
                        {open && (
                            <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
                                {results.map((r) => {
                                    const city = r.address.city || r.address.town || r.address.village || "";
                                    const country = r.address.country || "";
                                    const state = r.address.state || "";
                                    return (
                                        <button key={r.place_id} type="button" onClick={() => select(r)} className="flex w-full cursor-pointer flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-white/5">
                                            <span className="text-sm text-white">{city}{state ? `, ${state}` : ""}</span>
                                            <span className="text-xs text-white/30">{country}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-2 flex gap-3">
                    <Button type="button" onClick={onBack} className="flex-1 cursor-pointer border border-white/10 bg-transparent py-6 text-sm font-semibold text-white hover:bg-white/5 transition-all">Back</Button>
                    <Button type="submit" disabled={loading} className="flex-1 cursor-pointer py-6 bg-white text-sm font-bold text-neutral-950 hover:bg-neutral-200 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                        {loading ? "Submitting..." : "Create account"}
                    </Button>
                </div>
            </form>
        </>
    );
}