"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateLesson } from "@/store/lesson.store"
export function Step1() {
    const { data, updateData } = useCreateLesson()
    return (
        <>
            <div className="border-b px-6 py-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-base font-semibold mb-4">New Lesson</h1>
                    <p>Create new lesson in this module</p>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="title">Lessson title <span className="text-destructive">*</span></Label>
                            <Input
                                id="title"
                                placeholder="e.g. Introduction to TypeScript"
                                value={data.title}
                                onChange={(e) => updateData({ title: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}