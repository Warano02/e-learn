"use client"

import { useEffect, useState } from "react"
import { ModuleCard } from "@/components/courses/module-card"
import { Skeleton } from "@/components/ui/skeleton"
import axiosInstance from "@/lib/axios"
import { useParams } from "next/navigation"
import CreateModule from "./create-module"



function ModulesSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
        </div>
    )
}

export default function SingleCourse() {
    const courseId = useParams().id as string
    const [modules, setModules] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const { data } = await axiosInstance.get(`/c/${courseId}/modules`)
                setModules(data.modules || [])
            } catch (e) {
                console.error("Failed to fetch modules", e)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        if (courseId) fetchModules()
    }, [courseId])

    if (loading) return <ModulesSkeleton />
    if (error) return <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm font-medium">Failed to load modules</p>
        <p className="text-xs text-muted-foreground mt-1">Please try again later.</p>
    </div>
    if (!modules.length) return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm font-medium">No modules yet</p>
            <p className="text-xs text-muted-foreground mt-1">Add your first module to get started.</p>
        </div>
    )
    return (
        <div className="px-6 py-8 max-w-5xl mx-auto space-y-6">
            <h1 className="text-base font-semibold">Course modules</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module: any) => (
                    <ModuleCard key={module._id} courseId={courseId} module={module}  onRenamed={() => { }} onDeleted={() => { }} />
                ))}
                <CreateModule course={courseId} />
            </div>
        </div>
    )
}