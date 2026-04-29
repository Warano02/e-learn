"use client"

import { ChevronRight, ExternalLink } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BookmarksHeader } from "../dashboard/header"

type TLink = {
    label: string
    href: string
    external: boolean
    onClick?: () => void
}


function HelpAndSecurity() {

    const Links: TLink[] = [
        { label: "Terms of use", href: "", external: true },
        { label: "Confidentiality terms", href: "", external: true },
        { label: "Legal Informations ", href: "", external: true },
        { label: "Help and contact", href: "", external: true },
    ]

    return (
        <>
            <BookmarksHeader title="Security helper" />
            <section className="p-6 w-full relative space-y-8 pb-16">
                <div>
                    <h1 className="mt-1 text-3xl font-normal text-gray-900 dark:text-white">Help and Security</h1>
                </div>

                <div className="divide-y divide-gray-100 border-t border-gray-100">
                    {Links.map((item) =>
                        item.onClick ? (
                            <button key={item.label} type="button" onClick={item.onClick} className="flex w-full items-center justify-between py-4 group transition-colors hover:text-gray-900">
                                <span className={cn("text-sm transition-colors text-gray-600 dark:text-white group-hover:text-gray-900")}>
                                    {item.label}
                                </span>
                                <ChevronRight size={16} strokeWidth={1.75} className={cn("text-gray-400 group-hover:text-gray-600 transition-colors")} />
                            </button>
                        ) : (
                            <Link key={item.label} href={item.href} target={cn(item.external && "_blank")} rel={cn(item.external && "noopener noreferrer")} className="flex items-center justify-between py-4 group transition-colors hover:text-gray-900">
                                <span className={cn("text-sm transition-colors text-gray-600 dark:text-white group-hover:text-gray-900")}>
                                    {item.label}
                                </span>
                                {item.external
                                    ? <ExternalLink size={16} strokeWidth={1.75} className={cn("text-gray-400 group-hover:text-gray-600 transition-colors")} />
                                    : <ChevronRight size={16} strokeWidth={1.75} className={cn("text-gray-400 group-hover:text-gray-600 transition-colors")} />
                                }
                            </Link>
                        )
                    )}
                </div>

            </section>
        </>
    )
}

export default HelpAndSecurity