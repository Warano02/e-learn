"use client"

import { useWizardStore } from "@/store/wizard.store"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Video, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"

type UploadStatus = "idle" | "uploading" | "processing" | "done" | "failed"

const POLL_INTERVAL = 2000
const MAX_POLLS = 150
const MB_100 = 100 * 1024 * 1024

export function StepIntroVideo() {
  const { data, updateData } = useWizardStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)
  const [status, setStatus] = useState<UploadStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")
  const [isHeavyFile, setIsHeavyFile] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  const pollJob = async (jobId: string): Promise<void> => {
    let attempts = 0
    while (attempts < MAX_POLLS) {
      try {
        const res = await axiosInstance.get(`/files/job/${jobId}`)
        const job = res.data
        if (job.status === "done") {
          updateData({ explicationId: job.assetId })
          setStatus("done")
          setProgress(100)
          return
        }
        if (job.status === "failed") {
          setStatus("failed")
          setErrorMsg(job.error ?? "Upload failed. Please try again.")
          return
        }
        setStatus("processing")
        setProgress((prev) => Math.min(prev + 1, 98))
        await new Promise((r) => setTimeout(r, POLL_INTERVAL))
        attempts++
      } catch {
        setStatus("failed")
        setErrorMsg("Could not reach the server. Please try again.")
        return
      }
    }
    setStatus("failed")
    setErrorMsg("Upload timed out. Please try again.")
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const previewUrl = URL.createObjectURL(file)
    previewUrlRef.current = previewUrl

    const heavy = file.size > MB_100
    setIsHeavyFile(heavy)
    updateData({ explicationFile: file, explicationPreviewUrl: previewUrl, explicationId: undefined })
    setStatus("uploading")
    setProgress(0)
    setErrorMsg("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "video")
      formData.append("ownerType", "course")
      const res = await axiosInstance.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 90))
        },
      })

      if (res.status === 201) {
        updateData({ explicationId: res.data.asset._id })
        setStatus("done")
        setProgress(100)
        return
      }

      await pollJob(res.data.jobId)
    } catch {
      setStatus("failed")
      setErrorMsg("Upload failed. Please try again.")
    }
  }

  const clear = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    updateData({ explicationFile: null, explicationPreviewUrl: null, explicationId: undefined })
    setStatus("idle")
    setProgress(0)
    setErrorMsg("")
    setIsHeavyFile(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  const statusLabel = status === "uploading"
    ? `Uploading... ${progress}%`
    : isHeavyFile
    ? `Processing video on server... ${progress}%`
    : `Finalizing... ${progress}%`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold">Introduction video</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Upload a short video to pitch your course to students. This is what they'll see before enrolling.
        </p>
      </div>

      {!data.explicationPreviewUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "h-64 rounded-md border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3",
            "text-muted-foreground hover:border-primary/50 hover:bg-muted/40 transition-colors"
          )}
        >
          <div className="size-12 rounded-full bg-muted flex items-center justify-center">
            <Video className="size-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Click to upload your intro video</p>
            <p className="text-xs mt-0.5">MP4, MOV, WebM — up to 500MB</p>
          </div>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
            <Upload className="size-3.5 mr-1.5" />
            Browse file
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-md overflow-hidden border bg-black">
            <video src={data.explicationPreviewUrl} controls className="w-full max-h-72" />
            {status !== "uploading" && status !== "processing" && (
              <button
                onClick={clear}
                className="absolute top-2 right-2 size-7 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black/90"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="rounded-md border px-3 py-2.5 space-y-2">
            <div className="flex items-center gap-2">
              {status === "done" && <CheckCircle2 className="size-4 text-green-500 shrink-0" />}
              {(status === "uploading" || status === "processing") && <Loader2 className="size-4 animate-spin text-primary shrink-0" />}
              {status === "failed" && <AlertCircle className="size-4 text-destructive shrink-0" />}
              <span className="text-sm font-medium truncate flex-1">{data.explicationFile?.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {data.explicationFile ? (data.explicationFile.size / 1024 / 1024).toFixed(1) : 0} MB
              </span>
            </div>

            {(status === "uploading" || status === "processing") && (
              <div className="space-y-1">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{statusLabel}</p>
              </div>
            )}

            {status === "failed" && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-destructive">{errorMsg}</p>
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clear}>
                  Try again
                </Button>
              </div>
            )}

            {status === "done" && (
              <p className="text-xs text-green-600 dark:text-green-400">Video ready — your course can now be published.</p>
            )}
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />

      <div className="rounded-md bg-muted px-4 py-3 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground text-sm">Tips for a great intro video</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Keep it between 1 and 3 minutes</li>
          <li>Explain clearly what students will learn</li>
          <li>Good audio quality matters more than video quality</li>
        </ul>
      </div>
    </div>
  )
}