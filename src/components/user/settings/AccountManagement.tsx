"use client"

import { useState } from "react"
import { Eye, EyeOff, Info, Lock } from "lucide-react"

import { useAuthStore } from "@/store/auth.store"
import { BookmarksHeader } from "../dashboard/header"
import { Input } from "@/components/ui/input"


function PasswordInput({ id, label, placeholder, value, onChange, }: { id: string, label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
    const [visible, setVisible] = useState(false)

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-white">
                {label}
            </label>
            <div className="relative">
                <Input id={id} type={visible ? "text" : "password"} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl  px-4 py-3 pr-11 text-sm transition-all " />
                <button type="button" onClick={() => setVisible((v) => !v)} className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600" aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                    {visible ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
                </button>
            </div>
        </div>
    )
}




function AccountManagement() {
    const { user } = useAuthStore()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
 
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!currentPassword || !newPassword) return

        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            console.log({ currentPassword, newPassword });

            setSuccess(true)
            setCurrentPassword("")
            setNewPassword("")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Une erreur est survenue.")
        } finally {
            setLoading(false)
        }
    }

    const canSubmit = currentPassword.length > 0 && newPassword.length > 0 && !loading

    return (
        <>
            <BookmarksHeader title="Settings" />
            <section className=" w-2/3 relative space-y-8 pt-6">

                <div>
                    <h1 className="mt-1 text-3xl font-normal text-gray-900 dark:text-white">Password management</h1>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-input/30 px-4 py-3">
                    <Info size={16} className="mt-0.5 shrink-0 text-blue-500" strokeWidth={2} />
                    <p className="text-sm text-blue-800 leading-snug">
                        By updating your password, you will automatically redirect to the login page.
                    </p>
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-white">
                            Email
                        </label>
                        <div className="relative">
                            <input id="email" type="email" value={user?.email || "felix@warano.dev"} readOnly className="w-full cursor-not-allowed rounded-xl border border-gray-200 dark:border-0 bg-gray-50 dark:bg-input/30 px-4 py-3 pr-11 text-sm text-gray-400 outline-none" />
                            <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" strokeWidth={1.75} />
                        </div>
                        <p className="text-xs text-gray-400">
                            For some security reason, updating your email address is impossible.
                        </p>
                    </div>

                    <PasswordInput id="current-password" label="Current password" placeholder="My Current password" value={currentPassword} onChange={setCurrentPassword} />

                    <PasswordInput id="new-password" label="New password" placeholder="My New password" value={newPassword} onChange={setNewPassword} />

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600">Password update</p>
                    )}

                    <button type="button" onClick={handleSubmit} disabled={!canSubmit} className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition-all ${canSubmit ? "bg-gray-900 hover:bg-gray-700 active:scale-[0.98] cursor-pointer" : "cursor-not-allowed bg-gray-300"}`}>
                        {loading ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </section>
        </>
    )
}

export default AccountManagement