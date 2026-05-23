"use client"

import { Step1 } from "@/components/courses/create-lesson/step-1"
import Step2 from "@/components/courses/create-lesson/step-2"
import { Step3 } from "@/components/courses/create-lesson/step-3"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axios"
import { useCreateLesson } from "@/store/lesson.store"
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

const stepComponents = {
    1: Step1,
    2: Step2,
    3: Step3,
}
function NewCourseClient() {
    const { moduleId,id } = useParams()
    const { step, nextStep, prevStep, data, reset } = useCreateLesson()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const StepComponent = stepComponents[step as 1 | 2 | 3]
    const handleSubmit = async () => {
        setLoading(true)
        try {
            const { data: { lesson } } = await axiosInstance.post(`/c/modules/${moduleId}/lesson`,data)
            toast("Lesson created successfully !")
            console.log(lesson)
            router.replace(`/admin/courses/${id}/modules/${moduleId}`)
        } catch (e) {
            console.error("Error occured while trying to publish lesson :", e)
            toast.error("Error occured while trying to publish lesson !")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex flex-col h-full">
            <StepComponent />
            <div className="border-t px-6 py-3">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={prevStep} disabled={step === 1 || loading} className="gap-1.5">
                        <ArrowLeft className="size-3.5" />
                        Back
                    </Button>

                    {step < 3 ? (
                        <Button size="sm" onClick={nextStep} className="gap-1.5">
                            {step == 1 ? "Next" : "Save and upload attachment"}
                            <ArrowRight className="size-3.5" />
                        </Button>
                    ) : (
                        <Button size="sm" onClick={handleSubmit} disabled={loading} className="gap-1.5">
                            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                            {loading ? "Publishing..." : "Publish Course"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NewCourseClient