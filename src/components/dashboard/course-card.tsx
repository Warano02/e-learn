"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ExternalLink, Copy, Pencil, Trash2, Tag, Archive, } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import EditCourse from "./edit-course";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "sonner";

type TInterest = {
    _id: string,
    name: string

}
export interface ICourse {
    _id: string,
    title: string
    favicon: string
    description: string,
    interests: TInterest[]
}

function CourseCard({ course }: { course: ICourse; }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: course.description,
        immediatelyRender: false,
    })
    const [actual, setActual] = useState(course)

    const handleCopyUrl: () => void = () => {
        navigator.clipboard.writeText(`${window.location.origin}/course/${course._id}`);
        toast.success("Link copied successfully !", { position: "top-right" })
    };

    const handleOpenUrl = () => {
        window.open(`/admin/courses/${course._id}`);
    };
    return (
        <div className="group relative flex flex-col rounded-xl border bg-card overflow-hidden hover:bg-accent/30 transition-colors">
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon-xs" className="bg-background/80 backdrop-blur-sm">
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
                            <EditCourse course={actual} setActual={setActual}>
                                <div className="flex gap-2 cursor-pointer">
                                    <Pencil className="size-4 mr-2" />
                                    Edit
                                </div>
                            </EditCourse>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <button className="w-full text-left cursor-pointer" onClick={handleOpenUrl}>
                <div className="h-32 bg-linear-to-br from-muted/50 to-muted flex items-center justify-center">
                    <div className="size-12 rounded-xl bg-background shadow-sm flex items-center justify-center">
                        <Image
                            src={actual.favicon}
                            alt={actual.title}
                            width={32}
                            height={32}
                            className={cn("size-8",)}
                        />
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium line-clamp-1">{actual.title}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                        <EditorContent editor={editor} />
                    </div>
                    {course.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {actual.interests.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className={cn(
                                        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium",
                                        "bg-foreground/10 text-foreground")}
                                >
                                    {tag.name}
                                </span>
                            ))}
                            {actual.interests.length > 3 && (
                                <span className="text-[10px] text-muted-foreground py-0.5">
                                    +{actual.interests.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </button>
        </div>
    )
}

export default CourseCard