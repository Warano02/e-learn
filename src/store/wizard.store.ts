"use client"

import { create } from "zustand"
import type { CourseWizardData, WizardStep } from "@/types/course-wizard"
import { toast } from "sonner"

interface WizardStore {
  step: WizardStep
  data: CourseWizardData
  setStep: (step: WizardStep) => void
  nextStep: () => void
  prevStep: () => void
  updateData: (partial: Partial<CourseWizardData>) => void
  reset: () => void
}

const defaultData: CourseWizardData = {
  title: "",
  description: "",
  cover: null,
  coverPreviewUrl: null,
  favicon: "https://www.google.com/s2/favicons?domain=typescriptlang.org&sz=64",
  language: "en",
  isPublic: true,
  objectives: [""],
  interests: [],
  explicationFile: null,
  explicationPreviewUrl: null,
  explicationId: undefined,
  classroom: undefined,
}

const validateStep = (step: WizardStep, data: CourseWizardData): string | null => {
  if (step === 1) {
    if (!data.title.trim()) return "Course title is required."
    if (!data.description || data.description === "<p></p>") return "Course description is required."
    return null
  }
  return null
}

export const useWizardStore = create<WizardStore>((set, get) => ({
  step: 1,
  data: defaultData,

  setStep: (step) => set({ step }),

  nextStep: () => {
    const { step, data } = get()
    const error = validateStep(step, data)
    if (error) {
      toast.error(error)
      return
    }
    set((s) => ({ step: Math.min(s.step + 1, 2) as WizardStep }))
  },

  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) as WizardStep })),

  updateData: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),

  reset: () => set({ step: 1, data: defaultData }),
}))