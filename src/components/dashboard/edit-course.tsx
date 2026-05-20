"use client"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ICourse } from "./course-card"
import { RichTextEditor } from "../rich-text-editor"
import { Plus, X } from "lucide-react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { ScrollArea } from "../ui/scroll-area"

function EditCourse({ openEditor, course, setActual, setOpen, }: { course: ICourse, openEditor: boolean, setActual: (c: ICourse) => void, setOpen: (v: boolean) => void }) {
    const [loading, setLoading] = useState(false)
    const [payload, setPayload] = useState(course)

    const addObjective = () => setPayload((p) => ({ ...p, objectives: [...p.objectives, ""] }))

    const updateObjective = (index: number, value: string) => {
        const updated = [...payload.objectives]
        updated[index] = value
        setPayload((p) => ({ ...p, objectives: updated }))
    }

    const removeObjective = (index: number) => {
        setPayload((p) => ({
            ...p,
            objectives: p.objectives.filter((_, i) => i !== index),
        }))
    }

    const saveCourse = async () => {
        try {
            setLoading(true)
            const { data } = await axiosInstance.patch(
                "/c/edit/" + payload._id,
                payload
            )
            toast.success("Course edited successfully !")
            setActual(data.course)
            setOpen(false)
        } catch (e) {
            console.log("Error while editing course", e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Drawer open={openEditor} onOpenChange={setOpen} direction="left">
            <DrawerContent className="h-full flex flex-col">
                <DrawerHeader>
                    <DrawerTitle>Edit Course details</DrawerTitle>
                    <DrawerDescription>
                        Update details of your course.
                    </DrawerDescription>
                </DrawerHeader>

                <ScrollArea className="h-108.5 px-2">
                    <form
                        className={cn("grid items-start gap-6 pb-6")}
                        onSubmit={(e) => {
                            e.preventDefault()
                            saveCourse()
                        }}
                    >
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={payload.title}
                                onChange={(e) =>
                                    setPayload((p) => ({ ...p, title: e.target.value }))
                                }
                            />
                        </div>

                        <div className="grid gap-3">
                            <Label>Description</Label>
                            <RichTextEditor
                                value={payload.description}
                                onChange={(v) =>
                                    setPayload((p) => ({ ...p, description: v }))
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Learning objectives</Label>

                            {payload.objectives.map((obj, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Input
                                        placeholder={`Objective ${i + 1}`}
                                        value={obj}
                                        onChange={(e) =>
                                            updateObjective(i, e.target.value)
                                        }
                                    />

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="size-9 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeObjective(i)}
                                        disabled={payload.objectives.length === 1}
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addObjective}
                                className="gap-1.5"
                            >
                                <Plus className="size-3.5" />
                                Add objective
                            </Button>
                        </div>
                    </form>
                </ScrollArea>

                <DrawerFooter>
                    <Button onClick={saveCourse} disabled={loading}>
                        {loading ? "Saving..." : "Save changes"}
                    </Button>

                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default EditCourse