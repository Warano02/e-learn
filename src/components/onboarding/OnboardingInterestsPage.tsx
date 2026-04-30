"use client"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import { useRouter } from "next/navigation"

type Interest = {
    "_id": string,
    "name": string,
    "slug": string,
    "category": string
}

export default function OnboardingInterestsPage() {
    const [interests, setInterests] = useState<Interest[]>([])
    const [selected, setSelected] = useState<string[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await axiosInstance.get("/p/tags")
                if (!res.data) throw new Error("Failed to load interests")
                const data: Interest[] = res.data?.tags || []
                setInterests(data)
            } catch {
                setError("Could not load interests. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchInterests()
    }, [])

    const filtered = useMemo(() =>
        interests.filter((i) => i.name.toLowerCase().includes(search.toLowerCase())),
        [interests, search]
    )

    const toggle = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        )
    }

    const payload = { interests: selected }

    const handleContinue = async () => {
        // before redirect, i'll sent  a post request to the backend
        router.replace("/onboarding/step-2")
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-start justify-center px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black pointer-events-none" />
            <div className="relative z-10 w-full max-w-2xl mx-auto">
                <div className="w-9 h-9 rounded-xl bg-gray-700 animate-pulse mb-8" />
                <h1 className="text-white text-3xl font-bold mb-2" >
                    What topics do you want to learn?
                </h1>
                <p className="text-zinc-400 text-sm mb-6">Select all that apply — we'll personalize your learning path.</p>
                <div className="relative mb-5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search a topic..." className="pl-9 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 rounded-xl focus-visible:ring-zinc-600" />
                </div>
                {loading && (
                    <div className="flex items-center gap-2 text-zinc-400 text-sm py-6">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading topics...
                    </div>
                )}
                {error && <p className="text-red-400 text-sm py-4">{error}</p>}
                {!loading && !error && filtered.length === 0 && (
                    <p className="text-zinc-500 text-sm py-4">No topics found for "{search}"</p>
                )}
                {!loading && !error && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {filtered.map((interest) => {
                            const isSelected = selected.includes(interest._id)
                            return (
                                <button key={interest._id} onClick={() => toggle(interest._id)} className={cn("px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer", isSelected ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white")}>
                                    {interest.name}
                                </button>
                            )
                        })}
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <Button onClick={handleContinue} disabled={selected.length === 0} className="bg-white text-black font-semibold px-7 py-5 rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm cursor-pointer">
                        Continue
                    </Button>
                </div>
                {selected.length > 0 && (
                    <p className="mt-4 text-zinc-600 text-xs">
                        {selected.length} topic{selected.length > 1 ? "s" : ""} selected
                    </p>
                )}
            </div>
        </div>
    )
}