"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Clock, BookOpen, Pencil, Trash2, Lock, Unlock } from "lucide-react"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

interface ModuleCardProps {
    courseId: string
    module: {
        _id: string
        title: string
        description: string
        order: number
        estimatedDuration: number
        isLocked: boolean
        lessonsCount: number
    }
    onRenamed: (id: string, title: string) => void
    onDeleted: (id: string) => void
}

export function ModuleCard({ courseId, module, onRenamed, onDeleted }: ModuleCardProps) {
    const router = useRouter()
    const [renameOpen, setRenameOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [newTitle, setNewTitle] = useState(module.title)
    const [renaming, setRenaming] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleRename = async () => {
        if (!newTitle.trim() || newTitle === module.title) {
            setRenameOpen(false)
            return
        }
        setRenaming(true)
        try {
            await axiosInstance.patch(`/teacher/modules/${module._id}`, { title: newTitle.trim() })
            onRenamed(module._id, newTitle.trim())
            setRenameOpen(false)
            toast.success("Module renamed.")
        } catch {
            toast.error("Failed to rename module.")
        } finally {
            setRenaming(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await axiosInstance.delete(`/teacher/modules/${module._id}`)
            onDeleted(module._id)
            setDeleteOpen(false)
            toast.success("Module deleted.")
        } catch {
            toast.error("Failed to delete module.")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <Card
                onClick={() => router.push(`/admin/courses/${courseId}/modules/${module._id}`)}
                className={cn(
                    "group relative overflow-hidden border bg-background/70 backdrop-blur transition-all duration-300 cursor-pointer",
                    "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardContent className="relative p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                                    {String(module.order + 1).padStart(2, "0")}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold truncate">
                                            {module.title}
                                        </h3>

                                        <div
                                            className={cn(
                                                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                                                module.isLocked
                                                    ? "bg-orange-500/10 text-orange-500"
                                                    : "bg-emerald-500/10 text-emerald-500"
                                            )}
                                        >
                                            {module.isLocked ? (
                                                <>
                                                    <Lock className="size-3" />
                                                    Locked
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="size-3" />
                                                    Public
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Module overview
                                    </p>
                                </div>
                            </div>

                            {module.description && (
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {module.description}
                                </p>
                            )}

                            <div className="flex items-center gap-2 flex-wrap pt-1">
                                <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                    <BookOpen className="size-3.5" />
                                    <span>
                                        {module.lessonsCount} lesson{module.lessonsCount > 1 ? "s" : ""}
                                    </span>
                                </div>

                                {module.estimatedDuration > 0 && (
                                    <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                                        <Clock className="size-3.5" />
                                        <span>{module.estimatedDuration} min</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 shrink-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-muted"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-44 rounded-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DropdownMenuItem
                                    onClick={() => {
                                        setNewTitle(module.title)
                                        setRenameOpen(true)
                                    }}
                                >
                                    <Pencil className="size-3.5 mr-2" />
                                    Rename
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => setDeleteOpen(true)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="size-3.5 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Rename module</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-1.5 py-2">
                        <Label htmlFor="module-title">Title</Label>
                        <Input
                            id="module-title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRename()}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setRenameOpen(false)} disabled={renaming}>Cancel</Button>
                        <Button onClick={handleRename} disabled={renaming || !newTitle.trim()}>
                            {renaming ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete module</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete <span className="font-medium text-foreground">"{module.title}"</span>? All lessons inside will be permanently removed.
                    </p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}