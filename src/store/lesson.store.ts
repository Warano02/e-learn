"use client";

import { create } from "zustand";
import { toast } from "sonner";
interface CourseWizardData {
  title: string;
  content: string;
  attachment: string;

  file: File | null;
}

type WizardStep = 1 | 2 | 3;
interface WizardStore {
  step: WizardStep;
  data: CourseWizardData;
  setStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  getCourse: (id: string) => void;
  updateData: (partial: Partial<CourseWizardData>) => void;
  reset: () => void;
}

const defaultData: CourseWizardData = {
  title: "",
  content: "",
  attachment: "",
  file: null,
};

const validateStep = (
  step: WizardStep,
  data: CourseWizardData,
): string | null => {
  if (step === 1) {
    if (!data.title.trim()) return "Course title is required.";
    return null;
  }
  return null;
};

export const useCreateLesson = create<WizardStore>((set, get) => ({
  step: 1,
  data: defaultData,

  setStep: (step) => set({ step }),

  nextStep: () => {
    const { step, data } = get();
    const error = validateStep(step, data);
    if (error) {
      toast.error(error, { position: "top-right" });
      return;
    }
    set((s) => ({ step: Math.min(s.step + 1, 3) as WizardStep }));
  },

  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) as WizardStep })),

  updateData: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),

  reset: () => set({ step: 1, data: defaultData }),
  getCourse: async (id) => {},
}));
