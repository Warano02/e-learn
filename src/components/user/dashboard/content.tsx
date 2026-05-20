"use client"

import { useBookmarksStore } from "@/store/bookmarks-store";
import { BookmarkCard } from "./bookmark-card";
import { StatsCards } from "./stats-cards";
import { Bookmark } from "@/types";
import { useEffect, useState } from "react";


type TResponse = { classroomCourses: Bookmark[], continueCourses: Bookmark[], recommendedCourses: Bookmark[], tags: number }
export function BookmarksContent() {
  const {
   
    loading,
    fetchCourses
  } = useBookmarksStore();
  const [data, setData] = useState<TResponse>()

  const f = async () => {
    const d = await fetchCourses()
    return setData(d)
  }
  useEffect(() => {
    f()
  }, [])


  if (loading || !data) return <LoadingContent />
  if ((data.classroomCourses.length + data.continueCourses.length + data.recommendedCourses.length) == 0) return <div className="flex-1 w-full overflow-auto">
    <div className="p-4 md:p-6 space-y-6">
      <StatsCards classes={0} total={0} collection={0} tags={data.tags} />
      <NoBookmark />
    </div>
  </div>

  return <div className="flex-1 w-full overflow-auto">
    <div className="p-4 md:p-6 space-y-6">
      <StatsCards classes={data.classroomCourses.length} total={data.classroomCourses.length + data.continueCourses.length + data.recommendedCourses.length} collection={0} tags={data.tags} />

      {data.continueCourses.length > 0 && <RenderContent title="Continue your course !" data={data.continueCourses} />}
      {data.classroomCourses.length > 0 && <RenderContent title="Some course into Your ClassRooms" data={data.classroomCourses} />}
      {data.recommendedCourses.length > 0 && <RenderContent title="POPULAR COURSES" data={data.recommendedCourses} />}

    </div>
  </div>
}

const RenderContent = ({ title, data }: { title: string, data: Bookmark[] }) => {
  const { viewMode } = useBookmarksStore()
  // console.log(title,data)
  return (<div className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {data.length}
        </p>
      </div>
    </div>

    {viewMode === "grid" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((bookmark) => (
          <BookmarkCard key={bookmark._id} bookmark={bookmark} />
        ))}
      </div>
    ) : (
      <div className="flex flex-col gap-2">
        {data.map((bookmark) => (
          <BookmarkCard
            key={bookmark._id}
            bookmark={bookmark}
            variant="list"
          />
        ))}
      </div>
    )}

  </div>
  )
}

const LoadingContent = () => {
  return (<div className="flex-1 w-full overflow-auto">
    <div className="p-4 md:p-6 space-y-6">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">
              {"All Bookmarks"}
            </h2>
            <p className="text-sm text-muted-foreground">
              12 bookmark
            </p>
            <span className="h-4 w-65 bg-gray-300 animation-pulse"></span>
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* <BookmarkCard /> */}

        </div>



      </div>
    </div>
  </div>)
}
const NoBookmark = ({ title, msg }: { title?: string, msg?: string }) => {
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
      <h3 className="text-lg font-medium mb-1">{title || "No bookmarks found"} </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {msg || ` Try adjusting your search or filter to find what you&apos;re
            looking for...`}
      </p>

    </div>
  )
}