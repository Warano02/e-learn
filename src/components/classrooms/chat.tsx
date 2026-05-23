"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useChatStore } from "@/store/chat.store"
import { useAuthStore } from "@/store/auth.store"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Send, Paperclip, Mic, StopCircle, ImageIcon, FileText,
    Film, Music, X, Download, Play, Pause, File, ChevronRight, School,
    Phone,
    Video
} from "lucide-react"
interface RoomMember {
    _id: string
    name: string
    avatar: string | null
    role: "student" | "teacher"
}

interface RoomDetails {
    _id: string
    name: string
    description: string
    slogan?: string
    joinCode: string
    members: RoomMember[]
}
const MOCK_ROOM: RoomDetails = {
    _id: "mock-room-1",
    name: "Math — Grade 10",
    description: "Welcome to the classroom and take all you can",
    slogan: "Learn. Think. Grow.",
    joinCode: "26CA000FI",
    members: [
        { _id: "1", name: "Alice Martin", avatar: null, role: "teacher" },
        { _id: "2", name: "Bob Dupont", avatar: null, role: "student" },
        { _id: "3", name: "Clara Ndi", avatar: null, role: "student" },
        { _id: "4", name: "David Kone", avatar: null, role: "student" },
        { _id: "5", name: "Eva Mbarga", avatar: null, role: "student" },
        { _id: "6", name: "Frank Eto", avatar: null, role: "student" },
    ],
}
export default function GroupChatPage() {
    const {  roomId } = useParams<{ roomId: string }>()
    const { user } = useAuthStore()
    const router = useRouter()
    const {
        messages, fetching, sending, hasMore, page,
        typingUsers, fetchMessages, sendMessage,
        joinRoom, leaveRoom, emitTypingStart, emitTypingStop,
    } = useChatStore()
    const [room] = useState<RoomDetails>(MOCK_ROOM)

    const bottomRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const [text, setText] = useState("")
    const [preview, setPreview] = useState<{ file: File; url: string; type: string } | null>(null)
    const [recording, setRecording] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
    const [audioChunks, setAudioChunks] = useState<BlobPart[]>([])
    const [playingId, setPlayingId] = useState<string | null>(null)
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

    useEffect(() => {
        fetchMessages(roomId)
        joinRoom(roomId)
        return () => { leaveRoom(roomId) }
    }, [roomId])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleScroll = useCallback(() => {
        const container = messagesContainerRef.current
        if (!container || fetching || !hasMore) return
        if (container.scrollTop === 0) {
            fetchMessages(roomId, page + 1)
        }
    }, [fetching, hasMore, page, roomId])

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
        emitTypingStart(roomId, user!._id)
        if (typingTimeout.current) clearTimeout(typingTimeout.current)
        typingTimeout.current = setTimeout(() => emitTypingStop(roomId, user!._id), 2000)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleSend = async () => {
        if (!text.trim() && !preview) return
        const fd = new FormData()
        if (preview) {
            const type = preview.type.startsWith("image") ? "image"
                : preview.type.startsWith("video") ? "video"
                    : preview.type.startsWith("audio") ? "audio"
                        : preview.type === "application/pdf" ? "pdf"
                            : "file"
            fd.append("type", type)
            fd.append("file", preview.file)
            if (text.trim()) fd.append("content", text.trim())
            URL.revokeObjectURL(preview.url)
            setPreview(null)
        } else {
            fd.append("type", "text")
            fd.append("content", text.trim())
        }
        setText("")
        await sendMessage(roomId, fd)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setPreview({ file, url: URL.createObjectURL(file), type: file.type })
        e.target.value = ""
    }

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mr = new MediaRecorder(stream)
        const chunks: BlobPart[] = []
        mr.ondataavailable = e => chunks.push(e.data)
        mr.onstop = async () => {
            const blob = new Blob(chunks, { type: "audio/webm" })
            // @ts-ignore
            const file = new File([blob], `voice_${Date.now()}.webm`, { type: "audio/webm" })
            const fd = new FormData()
            fd.append("type", "voice")
            fd.append("file", file)
            stream.getTracks().forEach(t => t.stop())
            await sendMessage(roomId, fd)
        }
        mr.start()
        setMediaRecorder(mr)
        setAudioChunks(chunks)
        setRecording(true)
    }

    const stopRecording = () => {
        mediaRecorder?.stop()
        setRecording(false)
        setMediaRecorder(null)
    }

    const toggleAudio = (id: string, url: string) => {
        if (!audioRefs.current[id]) {
            audioRefs.current[id] = new Audio(url)
            audioRefs.current[id].onended = () => setPlayingId(null)
        }
        if (playingId === id) {
            audioRefs.current[id].pause()
            setPlayingId(null)
        } else {
            Object.values(audioRefs.current).forEach(a => a.pause())
            audioRefs.current[id].play()
            setPlayingId(id)
        }
    }

    const isMe = (senderId: string) => senderId === user?._id || senderId === "me"

    const typingInRoom = typingUsers.filter(t => t.conversationId === roomId && t.userId !== user?._id)

    return (
        <div className="flex flex-col h-full w-full bg-background">
            <div
                onClick={() => router.push(`/rooms/${roomId}/messages/settings`)}
                className="flex items-center gap-3 px-4 py-3 border-b bg-background hover:bg-accent/30 transition-colors cursor-pointer shrink-0"
            >
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold truncate">{room.name}</h2>
                        <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex -space-x-1.5">
                            {room.members.slice(0, 4).map(member => (
                                <Avatar key={member._id} className="size-4 border border-background">
                                    <AvatarImage src={member.avatar ?? undefined} />
                                    <AvatarFallback className="text-[8px]">{member.name[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground truncate">
                            {room.members.slice(0, 3).map(m => m.name.split(" ")[0]).join(", ")}
                            {room.members.length > 3 && ` +${room.members.length - 3}`}
                        </span>
                    </div>
                </div>
            
            </div>
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scroll-smooth"
            >
                {fetching && page === 1 ? (
                    <div className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={cn("flex items-end gap-2", i % 2 === 0 ? "justify-start" : "justify-end")}>
                                {i % 2 === 0 && <Skeleton className="size-8 rounded-full shrink-0" />}
                                <Skeleton className={cn("h-12 rounded-2xl", i % 2 === 0 ? "w-48 rounded-bl-sm" : "w-64 rounded-br-sm")} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {fetching && page > 1 && (
                            <div className="flex justify-center py-2">
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                        )}
                        {messages.map((msg, idx) => {
                            const mine = isMe(msg.sender._id)
                            const prevMsg = messages[idx - 1]
                            const isSameGroup = prevMsg && prevMsg.sender._id === msg.sender._id
                            return (
                                <div key={msg._id} className={cn("flex items-end gap-2", mine ? "justify-end" : "justify-start", isSameGroup ? "mt-0.5" : "mt-4")}>
                                    {!mine && (
                                        <div className="shrink-0 w-8">
                                            {!isSameGroup && (
                                                <Avatar className="size-8">
                                                    <AvatarImage src={msg.sender.avatar ?? undefined} />
                                                    <AvatarFallback className="text-xs">{msg.sender.name?.[0]?.toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )}
                                    <div className={cn("flex flex-col max-w-[65%]", mine ? "items-end" : "items-start")}>
                                        {!mine && !isSameGroup && (
                                            <span className="text-[10px] text-muted-foreground mb-1 ml-1">{msg.sender.name}</span>
                                        )}
                                        <div className={cn(
                                            "relative px-3 py-2 rounded-2xl text-sm leading-relaxed",
                                            mine
                                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                                : "bg-muted text-foreground rounded-bl-sm",
                                            msg.pending && "opacity-60"
                                        )}>
                                            {msg.type === "text" && <p className="whitespace-pre-wrap wrap-break-word">{msg.content}</p>}

                                            {msg.type === "image" && msg.attachment && (
                                                <div className="space-y-1">
                                                    <img src={msg.attachment.url} alt={msg.attachment.name} className="rounded-xl max-w-70 max-h-80 object-cover" />
                                                    {msg.content && <p className="text-xs mt-1 whitespace-pre-wrap">{msg.content}</p>}
                                                </div>
                                            )}

                                            {msg.type === "video" && msg.attachment && (
                                                <video src={msg.attachment.url} controls className="rounded-xl max-w-70" />
                                            )}

                                            {(msg.type === "audio" || msg.type === "voice") && msg.attachment && (
                                                <div className="flex items-center gap-2 min-w-40">
                                                    <button onClick={() => toggleAudio(msg._id, msg.attachment!.url)} className={cn("size-8 rounded-full flex items-center justify-center shrink-0", mine ? "bg-primary-foreground/20 text-primary-foreground" : "bg-foreground/10 text-foreground")}>
                                                        {playingId === msg._id ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                                                    </button>
                                                    <div className={cn("flex-1 h-1 rounded-full", mine ? "bg-primary-foreground/30" : "bg-foreground/20")}>
                                                        <div className="h-full w-0 rounded-full bg-current" />
                                                    </div>
                                                    {msg.type === "voice" && <Mic className="size-3 opacity-50" />}
                                                </div>
                                            )}

                                            {msg.type === "pdf" && msg.attachment && (
                                                <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2 min-w-45 p-1 rounded-lg", mine ? "hover:bg-primary-foreground/10" : "hover:bg-foreground/5")}>
                                                    <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", mine ? "bg-primary-foreground/20" : "bg-destructive/10")}>
                                                        <FileText className={cn("size-4", mine ? "text-primary-foreground" : "text-destructive")} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-medium truncate">{msg.attachment.name}</p>
                                                        {msg.attachment.size && <p className="text-[10px] opacity-60">{(msg.attachment.size / 1024).toFixed(1)} KB</p>}
                                                    </div>
                                                    <Download className="size-3.5 opacity-50 shrink-0" />
                                                </a>
                                            )}

                                            {msg.type === "file" && msg.attachment && (
                                                <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-2 min-w-45 p-1 rounded-lg", mine ? "hover:bg-primary-foreground/10" : "hover:bg-foreground/5")}>
                                                    <div className={cn("size-8 rounded-lg flex items-center justify-center shrink-0", mine ? "bg-primary-foreground/20" : "bg-muted-foreground/10")}>
                                                        <File className="size-4" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-medium truncate">{msg.attachment.name}</p>
                                                        {msg.attachment.size && <p className="text-[10px] opacity-60">{(msg.attachment.size / 1024).toFixed(1)} KB</p>}
                                                    </div>
                                                    <Download className="size-3.5 opacity-50 shrink-0" />
                                                </a>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-0.5 mx-1">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}

                        {typingInRoom.length > 0 && (
                            <div className="flex items-end gap-2 mt-4">
                                <div className="size-8 shrink-0" />
                                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                                    {[0, 1, 2].map(i => (
                                        <span key={i} className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </>
                )}
            </div>

            <div className="border-t bg-background px-4 py-3 space-y-2">
                {preview && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted text-sm">
                        <div className="size-8 rounded-lg bg-background flex items-center justify-center shrink-0">
                            {preview.type.startsWith("image") ? <ImageIcon className="size-4 text-primary" />
                                : preview.type.startsWith("video") ? <Film className="size-4 text-blue-500" />
                                    : preview.type.startsWith("audio") ? <Music className="size-4 text-green-500" />
                                        : preview.type === "application/pdf" ? <FileText className="size-4 text-destructive" />
                                            : <File className="size-4 text-muted-foreground" />}
                        </div>
                        <span className="flex-1 truncate text-xs text-muted-foreground">{preview.file.name}</span>
                        <button onClick={() => { URL.revokeObjectURL(preview.url); setPreview(null) }} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X className="size-4" />
                        </button>
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*,.pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                    <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground" onClick={() => fileInputRef.current?.click()}>
                        <Paperclip className="size-4" />
                    </Button>
                    <Textarea
                        value={text}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a message..."
                        rows={1}
                        className="resize-none min-h-9 max-h-30 flex-1 bg-muted border-none focus-visible:ring-0 rounded-xl text-sm py-2 px-3"
                    />
                    {text.trim() || preview ? (
                        <Button size="icon" className="h-9 w-9 shrink-0 rounded-xl" onClick={handleSend} disabled={sending}>
                            <Send className="size-4" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            variant={recording ? "destructive" : "ghost"}
                            className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground hover:text-foreground"
                            onClick={recording ? stopRecording : startRecording}
                        >
                            {recording ? <StopCircle className="size-4" /> : <Mic className="size-4" />}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}