"use client"

import { useWizardStore } from "@/store/wizard.store"
import { WizardStepper } from "@/components/wizard-stepper"
import { StepGeneral } from "@/components/steps/step-general"
import { StepIntroVideo } from "@/components/steps/step-intro-video"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axiosInstance from "@/lib/axios"

const stepComponents = {
  1: StepGeneral,
  2: StepIntroVideo,
}

export default function NewCoursePage() {
  const { step, nextStep, prevStep, data, reset } = useWizardStore()
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const StepComponent = stepComponents[step as 1 | 2]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.post("/c/create", {
        title: data.title,
        description: data.description,
        language: data.language,
        isPublic: data.isPublic,
        favicon: data.favicon,
        objectives: data.objectives.filter((o) => o.trim()),
        interests: data.interests,
        ...(data.classroom && { classroom: data.classroom }),
        explication: data.explicationId,
      })

      const courseId = res.data.data.course._id
      reset()
      router.push(`/admin/courses/${courseId}`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-base font-semibold mb-4">New Course</h1>
          <WizardStepper current={step} />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <StepComponent />
        </div>
      </div>

      <div className="border-t px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevStep}
            disabled={step === 1 || loading}
            className="gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Button>

          {step < 2 ? (
            <Button size="sm" onClick={nextStep} className="gap-1.5">
              Next
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