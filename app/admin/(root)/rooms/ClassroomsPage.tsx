"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Trash2, Plus, School, Copy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/lib/axios"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Classroom {
    _id: string
    name: string
    description: string
    slogan?: string
    joinCode: string
}

export function ClassroomsPage() {
    const router = useRouter()
    const [classrooms, setClassrooms] = useState<Classroom[]>([])
    const [fetching, setFetching] = useState(true)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: "", description: "", slogan: "" })

    useEffect(() => {
        axiosInstance.get("/t/classrooms")
            .then(res => setClassrooms(res.data.classRooms))
            .finally(() => setFetching(false))
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async () => {
        if (!form.name || !form.description) return
        setLoading(true)
        try {
            const res = await axiosInstance.post("/cr/create", form)
            setClassrooms(prev => [...prev, res.data])
            setForm({ name: "", description: "", slogan: "" })
            setDrawerOpen(false)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        // await axiosInstance.delete(`/cr/${id}`)
        toast.info("Delete functionality is currently disabled.")
        // setClassrooms(prev => prev.filter(r => r._id !== id))
    }

    if (fetching) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col rounded-xl border bg-card overflow-hidden">
                        <Skeleton className="h-28 w-full rounded-none" />
                        <div className="p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3 w-6 rounded-full" />
                                <Skeleton className="h-4 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-3/4 rounded-md" />
                            <Skeleton className="h-3 w-full rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {classrooms.map((room, index) => (
                    <div
                        key={room._id}
                        className="group relative flex flex-col rounded-xl border bg-card overflow-hidden hover:bg-accent/30 transition-colors cursor-pointer"
                        onClick={() => router.push(`/rooms/${room._id}`)}
                    >
                        <div className="absolute top-3 right-3 z-10">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-7 w-7 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontal className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(room.joinCode) }}>
                                        <Copy className="h-3.5 w-3.5 mr-2" />
                                        Copy code
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive" onClick={(e) => handleDelete(room._id, e)}>
                                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="h-28 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <div className="size-12 rounded-xl bg-background shadow-sm flex items-center justify-center text-primary">
                                <School className="size-6" />
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground font-mono">
                                    {room.joinCode}
                                </span>
                            </div>
                            <h3 className="font-medium text-sm line-clamp-1">{room.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">{room.slogan || room.description}</p>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card hover:bg-accent/30 hover:border-primary/40 transition-colors min-h-[200px] gap-2 text-muted-foreground hover:text-primary cursor-pointer"
                >
                    <div className="size-12 rounded-xl border-2 border-dashed flex items-center justify-center">
                        <Plus className="size-5" />
                    </div>
                    <span className="text-xs font-medium">New classroom</span>
                </button>
            </div>

            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetContent side="right" className="w-full sm:max-w-md flex flex-col gap-0 p-0">
                    <SheetHeader className="p-6 pb-4 border-b">
                        <SheetTitle>Create a classroom</SheetTitle>
                        <SheetDescription>Fill in the details to set up your new classroom.</SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col gap-5 p-6 flex-1 overflow-y-auto">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                            <Input id="name" name="name" placeholder="e.g. Math — Grade 10" value={form.name} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                            <Textarea id="description" name="description" placeholder="What is this classroom about?" rows={3} value={form.description} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="slogan">Slogan <span className="text-muted-foreground text-xs">(optional)</span></Label>
                            <Input id="slogan" name="slogan" placeholder="e.g. Learn. Think. Grow." value={form.slogan} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="p-6 pt-4 border-t">
                        <Button className="w-full" onClick={handleSubmit} disabled={loading || !form.name || !form.description}>
                            {loading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}
                            Create classroom
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}