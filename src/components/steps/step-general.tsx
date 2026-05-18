"use client"

import { useWizardStore } from "@/store/wizard.store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Upload, Globe, Lock } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import type { Tag, TagCategory } from "@/types/course-wizard"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "../rich-text-editor"
import axiosInstance from "@/lib/axios"

const categoryLabels: Record<TagCategory, string> = {
  programming: "Programming",
  design: "Design",
  data: "Data",
  business: "Business",
  security: "Security",
  devops: "DevOps",
  other: "Other",
}

export function StepGeneral() {
  const { data, updateData } = useWizardStore()
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [tagSearch, setTagSearch] = useState("")
  const [tagOpen, setTagOpen] = useState(false)

  useEffect(() => {

    axiosInstance.get("/p/tags")
      .then((res) => setTags(res.data.tags))
  }, [])

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    updateData({ cover: file, coverPreviewUrl: url })
  }

  const addObjective = () => updateData({ objectives: [...data.objectives, ""] })

  const updateObjective = (index: number, value: string) => {
    const updated = [...data.objectives]
    updated[index] = value
    updateData({ objectives: updated })
  }

  const removeObjective = (index: number) => {
    updateData({ objectives: data.objectives.filter((_, i) => i !== index) })
  }

  const toggleTag = (tagId: string) => {
    const updated = data.interests.includes(tagId)
      ? data.interests.filter((id) => id !== tagId)
      : [...data.interests, tagId]
    updateData({ interests: updated })
  }

  const grouped = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    if (tagSearch && !tag.name.toLowerCase().includes(tagSearch.toLowerCase())) return acc
    if (!acc[tag.category]) acc[tag.category] = []
    acc[tag.category].push(tag)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="title">Course title <span className="text-destructive">*</span></Label>
        <Input
          id="title"
          placeholder="e.g. Introduction to TypeScript"
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Cover image</Label>
        <div
          onClick={() => coverInputRef.current?.click()}
          className={cn(
            "relative h-40 rounded-md border-2 border-dashed cursor-pointer overflow-hidden transition-colors",
            "hover:border-primary/50 hover:bg-muted/50",
            data.coverPreviewUrl ? "border-transparent" : "border-border"
          )}
        >
          {data.coverPreviewUrl ? (
            <img src={data.coverPreviewUrl} alt="cover" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
              <Upload className="size-6" />
              <span className="text-sm">Click to upload cover image</span>
              <span className="text-xs">PNG, JPG up to 5MB</span>
            </div>
          )}
          {data.coverPreviewUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); updateData({ cover: null, coverPreviewUrl: null }) }}
              className="absolute top-2 right-2 size-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
      </div>

      <div className="space-y-1.5">
        <Label>Description <span className="text-destructive">*</span></Label>
        <RichTextEditor
          value={data.description}
          onChange={(v) => updateData({ description: v })}
          placeholder="Describe your course..."
          minHeight="min-h-40"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Language <span className="text-destructive">*</span></Label>
          <Select value={data.language} onValueChange={(v) => updateData({ language: v as "en" | "fr" })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border px-4 py-3">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Public course</p>
            <p className="text-xs text-muted-foreground">
              By default, your course will be public and visible to all users. You can change this setting later if you want to restrict access.
            </p>
          </div>
        </div>
        <Switch checked={data.isPublic} onCheckedChange={(v) => updateData({ isPublic: v })} />
      </div>

      <div className="space-y-2">
        <Label>Learning objectives</Label>
        <div className="space-y-2">
          {data.objectives.map((obj, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder={`Objective ${i + 1}`}
                value={obj}
                onChange={(e) => updateObjective(i, e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeObjective(i)}
                disabled={data.objectives.length === 1}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={addObjective} className="gap-1.5">
          <Plus className="size-3.5" />
          Add objective
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Topics / Interests</Label>
        <div className="relative">
          <Input
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            onFocus={() => setTagOpen(true)}
            onBlur={() => setTimeout(() => setTagOpen(false), 150)}
          />
          {tagOpen && (
            <div className="absolute z-10 top-full mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-auto">
              {Object.entries(grouped).map(([cat, items]) => (
                <div key={cat}>
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sticky top-0 bg-popover border-b">
                    {categoryLabels[cat as TagCategory]}
                  </p>
                  {items.map((tag) => (
                    <button
                      key={tag._id}
                      onMouseDown={() => toggleTag(tag._id)}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors cursor-pointer",
                        data.interests.includes(tag._id) && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              ))}
              {Object.keys(grouped).length === 0 && (
                <p className="px-3 py-3 text-sm text-muted-foreground text-center">No tags found</p>
              )}
            </div>
          )}
        </div>
        {data.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.interests.map((id) => {
              const tag = tags.find((t) => t._id === id)
              if (!tag) return null
              return (
                <Badge key={id} variant="secondary" className="gap-1 pr-1">
                  {tag.name}
                  <button onClick={() => toggleTag(id)} className="hover:text-destructive cursor-pointer">
                    <X className="size-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}