"use client"

import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import { useState } from "react"

function LoginForm() {
    const { login } = useAuthStore()
    const [data, setData] = useState({ email: "", password: "" })
    const router = useRouter()
    const handleSubmit = async () => {
        if (!data.email || !data.password) return alert("All the field are required")
        const res = await login(data)
console.log(res);

        if (!res.success) return alert(res.msg)
        if (res?.level) return window.location.href=`/${res.role == "teacher" ? 'admin' : 'user'}/onboarding/set-${res.level}`
        if (res.role == "teacher") return router.push("/admin")
        router.push("/user")
    }
    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
            <input type="email" onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" />
            <input type="text" onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))} placeholder="password" />
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginForm