export type Language = "en" | "fr"

export type TagCategory = "programming" | "design" | "data" | "business" | "security" | "devops" | "other"

export interface Tag {
  _id: string
  name: string
  slug: string
  category: TagCategory
  description?: string
}

export interface CourseWizardData {
  title: string
  description: string
  cover: File | null
  coverPreviewUrl: string | null
  favicon: string
  language: Language
  isPublic: boolean
  classroom?: string
  objectives: string[]
  interests: string[]
  explicationFile: File | null
  explicationPreviewUrl: string | null
  explicationId?: string
}

export type WizardStep = 1 | 2