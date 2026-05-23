import { create } from "zustand"
import { io, Socket } from "socket.io-client"
import axiosInstance from "@/lib/axios"

export type MessageType = "text" | "image" | "video" | "audio" | "pdf" | "voice" | "file"

export interface Attachment {
    url: string
    name: string
    size?: number
    mimeType?: string
}

export interface Message {
    _id: string
    roomId: string
    sender: {
        _id: string
        name: string
        avatar?: string
    }
    type: MessageType
    content?: string
    attachment?: Attachment
    createdAt: string
    pending?: boolean
}

interface TypingUser {
    userId: string
    conversationId: string
}

interface ChatStore {
    socket: Socket | null
    messages: Message[]
    fetching: boolean
    sending: boolean
    hasMore: boolean
    page: number
    typingUsers: TypingUser[]
    currentRoomId: string | null
    initSocket: (userId: string) => void
    joinRoom: (roomId: string) => void
    leaveRoom: (roomId: string) => void
    fetchMessages: (roomId: string, page?: number) => Promise<void>
    sendMessage: (roomId: string, payload: FormData) => Promise<void>
    emitTypingStart: (conversationId: string, userId: string) => void
    emitTypingStop: (conversationId: string, userId: string) => void
    disconnectSocket: () => void
    reset: () => void
}

const msgAudio = typeof window !== "undefined" ? new Audio("/mp3/msg.mp3") : null

const playMessageSound = () => {
    if (!msgAudio) return
    msgAudio.currentTime = 0
    msgAudio.play().catch(() => {})
}

const showBrowserNotification = (message: Message) => {
    if (typeof window === "undefined") return
    if (Notification.permission !== "granted") return

    const body = message.type === "text"
        ? message.content
        : `📎 ${message.type}`

    new Notification(message.sender.name, {
        body,
        icon: message.sender.avatar ?? "/favicon.ico",
        tag: message._id,
    })
}

const requestNotificationPermission = () => {
    if (typeof window === "undefined") return
    if (Notification.permission === "default") {
        Notification.requestPermission()
    }
}

export const useChatStore = create<ChatStore>((set, get) => ({
    socket: null,
    messages: [],
    fetching: false,
    sending: false,
    hasMore: true,
    page: 1,
    typingUsers: [],
    currentRoomId: null,

    initSocket: (userId) => {
        const existing = get().socket
        if (existing?.connected) return

        requestNotificationPermission()

        const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
            withCredentials: true,
            transports: ["websocket"],
        })

        socket.on("connect", () => {
            socket.emit("auth", userId)
        })

        socket.on("message:new", (message: Message) => {
            const { currentRoomId } = get()

            set(state => {
                const already = state.messages.some(m => m._id === message._id)
                if (already) return state
                return { messages: [...state.messages, message] }
            })

            const isOnMessageTab = currentRoomId === message.roomId && document.visibilityState === "visible"

            if (!isOnMessageTab) {
                playMessageSound()
                showBrowserNotification(message)
            }
        })

        socket.on("typing:start", ({ conversationId, userId }: TypingUser) => {
            set(state => {
                const already = state.typingUsers.some(t => t.userId === userId && t.conversationId === conversationId)
                if (already) return state
                return { typingUsers: [...state.typingUsers, { userId, conversationId }] }
            })
        })

        socket.on("typing:stop", ({ conversationId, userId }: TypingUser) => {
            set(state => ({
                typingUsers: state.typingUsers.filter(
                    t => !(t.userId === userId && t.conversationId === conversationId)
                ),
            }))
        })

        socket.on("disconnect", () => {
            set({ socket: null })
        })

        set({ socket })
    },

    joinRoom: (roomId) => {
        const { socket } = get()
        if (!socket) return
        socket.emit("conversation:join", roomId)
        set({ currentRoomId: roomId })
    },

    leaveRoom: (roomId) => {
        const { socket } = get()
        if (!socket) return
        socket.emit("conversation:leave", roomId)
        set({ currentRoomId: null })
    },

    fetchMessages: async (roomId, page = 1) => {
        set({ fetching: true })
        try {
            const res = await axiosInstance.get(`/classrooms/${roomId}/messages`, {
                params: { page, limit: 30 },
            })
            const incoming: Message[] = res.data.messages
            set(state => ({
                messages: page === 1 ? incoming : [...incoming, ...state.messages],
                hasMore: res.data.hasMore ?? incoming.length === 30,
                page,
            }))
        } finally {
            set({ fetching: false })
        }
    },

    sendMessage: async (roomId, payload) => {
        const tempId = `temp_${Date.now()}`
        const type = payload.get("type") as MessageType
        const content = payload.get("content") as string | null
        const file = payload.get("file") as File | null

        const optimistic: Message = {
            _id: tempId,
            roomId,
            sender: { _id: "me", name: "" },
            type,
            content: content ?? undefined,
            attachment: file
                ? { url: URL.createObjectURL(file), name: file.name, size: file.size, mimeType: file.type }
                : undefined,
            createdAt: new Date().toISOString(),
            pending: true,
        }

        set(state => ({ messages: [...state.messages, optimistic], sending: true }))

        try {
            const res = await axiosInstance.post(`/classrooms/${roomId}/messages`, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            set(state => ({
                messages: state.messages.map(m =>
                    m._id === tempId ? { ...res.data.message, pending: false } : m
                ),
            }))
        } catch {
            set(state => ({
                messages: state.messages.filter(m => m._id !== tempId),
            }))
        } finally {
            set({ sending: false })
        }
    },

    emitTypingStart: (conversationId, userId) => {
        get().socket?.emit("typing:start", { conversationId, userId })
    },

    emitTypingStop: (conversationId, userId) => {
        get().socket?.emit("typing:stop", { conversationId, userId })
    },

    disconnectSocket: () => {
        const { socket } = get()
        if (!socket) return
        socket.disconnect()
        set({ socket: null })
    },

    reset: () => set({
        messages: [],
        fetching: false,
        sending: false,
        hasMore: true,
        page: 1,
        typingUsers: [],
        currentRoomId: null,
    }),
}))