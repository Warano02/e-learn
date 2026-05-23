"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileQuestion, Clock, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"

import { cn } from "@/lib/utils"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from "@/lib/axios"

interface IModuleContain {
    _id: string,
    type: "lesson" | "quiz",
    title: string,
    duration?: number,
    questionsCount?: number
}

const mockModuleContents: IModuleContain[] = [
    {
        _id: "lesson-1",
        type: "lesson",
        title: "Welcome to the Course",
        duration: 8
    },
    {
        _id: "lesson-2",
        type: "lesson",
        title: "Understanding Variables and Data Types",
        duration: 14
    },
    {
        _id: "lesson-3",
        type: "lesson",
        title: "Functions and Parameters",
        duration: 21
    },
    {
        _id: "quiz-1",
        type: "quiz",
        title: "JavaScript Fundamentals Quiz",
        questionsCount: 10
    },
    {
        _id: "lesson-4",
        type: "lesson",
        title: "Arrays and Objects",
        duration: 18
    },
    {
        _id: "lesson-5",
        type: "lesson",
        title: "Async Programming Basics",
        duration: 26
    },
    {
        _id: "quiz-2",
        type: "quiz",
        title: "Async & Promises Assessment",
        questionsCount: 15
    }
]

export function ModuleContents() {
    const { moduleId, id } = useParams()
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [contain, setContain] = useState<IModuleContain[]>([])
    const handleOpen = (lessonId: string, type: "lesson" | "quiz") => {
        router.push(`/admin/courses/${id}/modules/${moduleId}/edit/${type}/${lessonId}`)
    }

    const fetchContains = async () => {
        try {
            const { data } = await axiosInstance.get(`/c/modules/${moduleId}/lessons`)
            console.log(data)
            setContain(data.lessons)
        } catch {
            console.log("Error occured while trying to get module contain")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchContains()
    }, [])
    if (loading) return <div className="grid grid-cols-4 gap-3 p-4">
        {
            Array.from({ length: 48 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
            ))
        }
    </div>

    return (
        <div className="space-y-4 p-4">
            <div className="grid grid-cols-4 gap-3">
                {contain.map((item, index) => (
                    <Card key={item._id} className={cn("group border bg-background transition-all hover:border-primary/20 hover:shadow-sm")}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div onClick={() => handleOpen(item._id, item.type as "lesson" | "quiz")} className="flex flex-1 cursor-pointer items-start gap-3 min-w-0">
                                    <div
                                        className={cn(
                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                            item.type === "lesson" ? "bg-primary/10 text-primary" : "bg-orange-500/10 text-orange-500"
                                        )}>
                                        {item.type === "lesson" ? (
                                            <BookOpen className="h-4 w-4" />
                                        ) : (
                                            <FileQuestion className="h-4 w-4" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs text-muted-foreground">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                            <div className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", item.type === "lesson" ? "bg-primary/10 text-primary" : "bg-orange-500/10 text-orange-500")}>
                                                {item.type === "lesson" ? "Lesson" : "Quiz"}
                                            </div>
                                        </div>

                                        <h3 className="mt-1 text-sm font-medium truncate">
                                            {item.title}
                                        </h3>

                                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                            {item.type === "lesson" &&
                                                item.duration && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>
                                                            {item.duration} min
                                                        </span>
                                                    </div>
                                                )}

                                            {item.type === "quiz" &&
                                                item.questionsCount && (
                                                    <span>
                                                        {item.questionsCount} questions
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 ">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleOpen(item._id, item.type as | "lesson" | "quiz")} >
                                            <Pencil className="mr-2 h-3.5 w-3.5" />
                                            Open
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleting(true)}>
                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <DeleteElem id={item._id} isOpen={deleting} setIsOpen={setDeleting} type={item.type} />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">

                <Link href={`/admin/courses/${id}/modules/${moduleId}/new`}>
                    <Card className="cursor-pointer border-dashed transition-all hover:border-primary/30" >
                        <CardContent className="flex items-center gap-3 p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Plus className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Add lesson
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Create a new lesson
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={`/admin/courses/${id}/modules/${moduleId}/new/quiz`}>
                    <Card className="cursor-pointer border-dashed transition-all hover:border-primary/30">
                        <CardContent className="flex items-center gap-3 p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <FileQuestion className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-sm font-medium">
                                    Create quiz
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Add assessment questions
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}

interface IDeleteElem {
    id: string
    isOpen: boolean,
    setIsOpen: (v: boolean) => void,
    type: string
}
const DeleteElem = ({ isOpen, setIsOpen, type, id }: IDeleteElem) => {
    const [deleting, setDeleting] = useState(false)
    const handleDelete = async () => {
        setDeleting(true)
    }
    return <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
            <DialogHeader>
                <DialogTitle>Delete module</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
                Are you sure you wan to  delete this <span className="text-foreground font-medium">{type == "lesson" ? "lesson" : "quiz"} </span> ?
            </p>

            <DialogFooter className="gap-4 flex">
                <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={deleting}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}