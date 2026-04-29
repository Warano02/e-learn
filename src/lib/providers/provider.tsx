"use client"

import { useAuthStore } from "@/store/auth.store"
import { useEffect } from "react"


function Provider({ children }: { children: React.ReactNode }) {
    const { fetchMe } = useAuthStore()
    useEffect(() => {
        fetchMe()
    }, [])
    return (
        <>
            {children}
        </>
    )
}

export default Provider