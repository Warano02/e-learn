"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Heart, MoreHorizontal, ExternalLink, Copy, Pencil, Trash2, Tag, Archive, } from "lucide-react";
import { cn } from "@/lib/utils";
import { Bookmark } from "@/types";
import { useState } from "react";
import axiosInstance from "@/lib/axios";

interface BookmarkCardProps {
  bookmark: Bookmark;
  variant?: "grid" | "list";
  callback?: (id: string) => void
}

export function BookmarkCard({ bookmark, variant = "grid", callback }: BookmarkCardProps) {
  const [isFavorite, setIsFavorite] = useState(bookmark.isFavorite)
  const toggleFavorite = async () => {
    setIsFavorite(prev => !prev)
    if (callback) callback(bookmark._id)
    return axiosInstance.patch(`/u/collections/sys/favorites/${bookmark._id}`);
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/course/${bookmark._id}`);
  };

  const handleOpenUrl = () => {
    window.open(`/course/${bookmark._id}`, "_blank");
  };

  if (variant === "list") {
    return (
      <div className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
        <div className="size-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
          <Image
            src={bookmark.favicon}
            alt={bookmark.title}
            width={24}
            height={24}
            className={cn("size-6", bookmark.hasDarkIcon && "dark:invert")}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{bookmark.title}</h3>
            {bookmark.interests.length > 0 && (
              <div className="hidden sm:flex items-center gap-1">
                {bookmark.interests.slice(0, 2).map((tag) => (
                  <span
                    key={tag._id}
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
                      "bg-foreground/10 text-foreground"
                    )}
                  >
                    {tag.name}
                  </span>
                ))}
                {bookmark.interests.length > 2 && (
                  <span className="text-[10px] text-muted-foreground">
                    +{bookmark.interests.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            { } url of the course
          </p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => toggleFavorite()}
          >
            <Heart
              className={cn(
                "size-4",
                isFavorite && "fill-red-500 text-red-500"
              )}
            />
          </Button>
          <Button variant="ghost" size="icon-xs" onClick={handleOpenUrl}>
            <ExternalLink className="size-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyUrl}>
                <Copy className="size-4 mr-2" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="size-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="size-4 mr-2" />
                Add to collection
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col rounded-xl border bg-card overflow-hidden hover:bg-accent/30 transition-colors">
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        <Button
          variant="secondary"
          size="icon-xs"
          className="bg-background/80 backdrop-blur-sm"
          onClick={() => toggleFavorite()}
        >
          <Heart
            className={cn(
              "size-4",
              isFavorite && "fill-red-500 text-red-500"
            )}
          />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon-xs"
              className="bg-background/80 backdrop-blur-sm"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyUrl}>
              <Copy className="size-4 mr-2" />
              Copy URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleOpenUrl}>
              <ExternalLink className="size-4 mr-2" />
              Open in new tab
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="size-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Tag className="size-4 mr-2" />
              Add To collectionn
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <button
        className="w-full text-left cursor-pointer"
        onClick={handleOpenUrl}
      >
        <div className="h-32 bg-linear-to-br from-muted/50 to-muted flex items-center justify-center">
          <div className="size-12 rounded-xl bg-background shadow-sm flex items-center justify-center">
            <Image
              src={bookmark.favicon}
              alt={bookmark.title}
              width={32}
              height={32}
              className={cn("size-8", bookmark.hasDarkIcon && "dark:invert")}
            />
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium line-clamp-1">{bookmark.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {bookmark.description}
          </p>
          {bookmark.interests.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {bookmark.interests.slice(0, 3).map((tag) => (
                <span
                  key={tag._id}
                  className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
                    "bg-foreground/10 text-foreground")}
                >
                  {tag.name}
                </span>
              ))}
              {bookmark.interests.length > 3 && (
                <span className="text-[10px] text-muted-foreground py-0.5">
                  +{bookmark.interests.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
