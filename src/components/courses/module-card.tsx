"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    MoreHorizontal,
    Clock,
    BookOpen,
    Pencil,
    Trash2,
    Lock,
    Unlock
} from "lucide-react"
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
            await axiosInstance.patch(`/c/modules/${module._id}`, {title: newTitle.trim()})
            onRenamed(module._id, newTitle.trim())
            setRenameOpen(false)
            toast.success("Module updated")
        } catch {
            toast.error("Update failed")
        } finally {
            setRenaming(false)
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await axiosInstance.delete(`/c/modules/${module._id}`)
            onDeleted(module._id)
            setDeleteOpen(false)
            toast.success("Module removed")
        } catch {
            toast.error("Delete failed")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <>
            <Card onClick={() => router.push(`/admin/courses/${courseId}/modules/${module._id}`) }
                className={cn("group cursor-pointer border bg-background transition-all","hover:border-primary/30 hover:shadow-sm")} >
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-xs font-medium">
                                {module.order + 1}
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium truncate">
                                        {module.title}
                                    </h3>

                                    <span
                                        className={cn(
                                            "text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1",
                                            module.isLocked
                                                ? "bg-muted text-muted-foreground"
                                                : "bg-primary/10 text-primary"
                                        )}
                                    >
                                        {module.isLocked ? (
                                            <Lock className="h-3 w-3" />
                                        ) : (
                                            <Unlock className="h-3 w-3" />
                                        )}
                                        {module.isLocked ? "Locked" : "Open"}
                                    </span>
                                </div>

                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                    {module.description || "No description"}
                                </p>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-40"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <DropdownMenuItem
                                    onClick={() => {
                                        setNewTitle(module.title)
                                        setRenameOpen(true)
                                    }}
                                >
                                    <Pencil className="h-3.5 w-3.5 mr-2" />
                                    Rename
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeleteOpen(true)}
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {module.lessonsCount}
                        </span>

                        {module.estimatedDuration > 0 && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {module.estimatedDuration}m
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Rename module</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-2 py-2">
                        <Label>Title</Label>
                        <Input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRename()}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setRenameOpen(false)}
                            disabled={renaming}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRename}
                            disabled={renaming || !newTitle.trim()}
                        >
                            Save
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
                        Delete <span className="text-foreground font-medium">{module.title}</span> ?
                    </p>

                    <DialogFooter className="gap-4 flex">
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteOpen(false)}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}