"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { WizardStep } from "@/types/course-wizard"

const steps = [
  { id: 1, label: "General Info" },
  { id: 2, label: "Intro Video" },
]

interface WizardStepperProps {
  current: WizardStep
}

export function WizardStepper({ current }: WizardStepperProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isDone = current > step.id
        const isActive = current === step.id
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-medium border transition-all duration-200",
                isDone && "bg-primary border-primary text-primary-foreground",
                isActive && "border-primary text-primary bg-primary/10",
                !isDone && !isActive && "border-border text-muted-foreground bg-muted"
              )}>
                {isDone ? <Check className="size-3.5" /> : <span>{step.id}</span>}
              </div>
              <span className={cn(
                "text-[11px] font-medium whitespace-nowrap",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "h-px flex-1 mx-2 mb-5 transition-all duration-300",
                isDone ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}