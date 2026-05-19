"use client"

import { useEffect, useState } from "react"
import CourseCard, { ICourse } from "./course-card"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

function MyCourseClient() {
    const [loading, setL] = useState(true)
    const [courses, setCourses] = useState<ICourse[]>([])
    const getMyCourses = async () => {
        try {
            const { data } = await axiosInstance.get("/t/courses")
    
            setCourses(data.courses)
        } catch (e) {
            console.error("error occured while trying to get course : ",e)
            toast.error("Error occured while getting your course. Please try again !", { position: "bottom-right" })
        } finally {
            setL(false)
        }
    }
    useEffect(() => {
        getMyCourses()
    }, [])

    if (loading) return <LoadingContent />
    if (!courses.length) return <NoCourses />
    return (
        <div className="flex-1 w-full overflow-auto">
            <div className="p-4 md:p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Your course in our platform
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {courses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const LoadingContent = () => {
    return (<div className="flex-1 w-full overflow-auto">
        <div className="p-4 md:p-6 space-y-6">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 20 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl border bg-card animation-pulse">
                        <div className={`size-10 rounded-lg  flex items-center justify-center`}>
                            <span className="size-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold"></p>
                            <p className="text-sm text-muted-foreground"></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>)
}
const NoCourses = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg
                    className="size-6 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-medium mb-1">{"No Course found"} </h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {` Try adjusting your search or filter to find what you&apos;re
            looking for...`}
            </p>

        </div>
    )
}
export default MyCourseClient