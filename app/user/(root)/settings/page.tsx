import { BookmarksHeader } from "@/components/user/dashboard/header"
import { LucideIcon, EyeOff, Mail, ShieldCheck, UserCog, ChevronRight, Ban, Star } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Settings | IW"
}

type TLink = {
  title: string
  desc: string
  link: string
  Icon: LucideIcon
}

const Links: TLink[] = [
  {
    title: "Help and security",
    desc: "General rules of usage....",
    link: "/user/settings/help-security",
    Icon: ShieldCheck,
  },
  {
    title: "Account management",
    desc: "Change password and account deletion",
    link: "/user/settings/password",
    Icon: UserCog,
  },
]

function Settings() {
  return (
    <>
      <BookmarksHeader title="Settings" />

      <section className="space-y-6 p-4  w-full relative overflow-y-auto">

        <div className="space-y-6">
          {Links.map((item) => (
            <Link key={item.desc} href={item.link} className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-black/30 px-4 py-4 group transition-colors hover:bg-gray-50 dark:hover:bg-black/30 hover:border-primary h-25">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center text-gray-500 group-hover:text-gray-700 transition-colors">
                <item.Icon size={20} strokeWidth={1.75} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-gray-900  dark:text-white leading-tight">{item.title}</p>
                <p className="text-sm text-gray-400 mt-0.5">{item.desc}</p>
              </div>

              <ChevronRight size={18} className="text-gray-400 shrink-0 group-hover:text-gray-600 transition-colors" />
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export default Settings