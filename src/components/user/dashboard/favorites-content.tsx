"use client";

import { useBookmarksStore } from "@/store/bookmarks-store";
import { BookmarkCard } from "./bookmark-card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Bookmark } from "@/types";
import axiosInstance from "@/lib/axios";

export function FavoritesContent() {
  const { viewMode, } = useBookmarksStore();
  const [favoriteBookmarks, setF] = useState<Bookmark[]>([]);
  const [loading, setL] = useState(true)

  const fav = async () => {
    try {
      const { data: { courses }, } = await axiosInstance.get<{ courses: Bookmark[] }>(
        "/u/collections/sys/favorites",
      );
      setF(courses)
      console.log("course set success!")
    } catch (e) {
      alert("error occured while getting favorites course")
    } finally {
      setL(false)
    }
  }

  const toggle = (id: string) => setF(prev => prev.filter(e => e._id !== id))


  useEffect(() => {
    fav()
  }, [])

  if (loading) return <p>Loading...</p>
  if (favoriteBookmarks.length == 0) return (
    <div className="flex-1 w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Star className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No favorites yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Mark bookmarks as favorites by clicking the heart icon to see them
            here.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 w-full overflow-auto">
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-card">
          <div className="size-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Star className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Favorite Course</h2>
            <p className="text-sm text-muted-foreground">
              {favoriteBookmarks.length} course
              {favoriteBookmarks.length !== 1 ? "s" : ""} marked as favorite
            </p>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteBookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark._id} callback={toggle} bookmark={bookmark} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {favoriteBookmarks.map((bookmark) => (
              <BookmarkCard
                callback={toggle}
                key={bookmark._id}
                bookmark={bookmark}
                variant="list"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

