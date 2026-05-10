"use state"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Leaf, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";

export interface IClassroomCard {
    _id: string,
    name: string,
    favicon: string,
    description: string,
    joinCode: string,
    status: "banned" | "pending" | "active"
}

const ClassRoomCard = ({ room }: { room: IClassroomCard }) => {

    const handleCopyUrl = () => navigator.clipboard.writeText(`${window.location.origin}/rooms/${""}`);

    const handleOpenUrl = () => room.status == "active" ? window.open(`/rooms/${room._id}`) : "";

    const leftClass = async () => {
        try {
            await axiosInstance.delete("/cr/left?classroom=" + room.joinCode)
            window.location.reload()
        } catch (e) {
            alert("Error occured while leaving the classroom. Please try again !")
        }
    }

    return (
        <div className={cn("group relative flex flex-col rounded-xl border bg-card overflow-hidden ", room.status == "active" && "hover:bg-accent/30 transition-colors")}>
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 justify-between w-full pl-6">
                {room.status !== "active" && (<button className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors", room.status == "banned" ? "bg-red-500" : "bg-amber-500/10 text-amber-500")}>
                    {
                        room.status == "banned" ? "Banned" : <>
                            <span className="size-2.5 rounded-full bg-amber-500/30 animation-pulse" /> pending
                        </>
                    }
                </button>)}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon-xs" className="bg-background/80 backdrop-blur-sm">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={room.status == "active" ? "end" : "center"} >
                        {
                            room.status == "active" ? (
                                <>
                                    <DropdownMenuItem onClick={handleCopyUrl}>
                                        <Copy className="size-4 mr-2" />
                                        Copy URL
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleOpenUrl}>
                                        <ExternalLink className="size-4 mr-2" />
                                        Open in new tab
                                    </DropdownMenuItem>
                                </>
                            )
                                : (
                                    <>
                                        <DropdownMenuItem onClick={leftClass}>
                                            <Leaf className="size-4 mr-2" />
                                            Left The classroom
                                        </DropdownMenuItem>
                                    </>
                                )

                        }

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <button className={cn("w-full text-left ", room.status == "active" ? "cursor-pointer" : "cursor-not-allowed")} onClick={handleOpenUrl}>
                <div className="h-32 bg-linear-to-br from-muted/50 to-muted flex items-center justify-center">
                    <div className="size-12 rounded-xl bg-background shadow-sm flex items-center justify-center">
                        {/* <Image
                            src={room.favicon}
                            alt={room.name}
                            width={32}
                            height={32}
                            className={cn("size-8", "dark:invert")}
                        /> */}
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium line-clamp-1">{room.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {room.description}
                    </p>
                </div>
            </button>

        </div>
    )
}


export default ClassRoomCard