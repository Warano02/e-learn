"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, MessageCircle, Settings, HelpCircle, ChevronDown, User, LogOut, Video, ClipboardList, FileText, FolderOpen, Bell, CalendarDays, } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel, } from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";



export default function ClassroomSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { roomId } = useParams<{ roomId: string }>();
    const { logout, user } = useAuthStore();
    const pathname = usePathname()
    const isTeacher = pathname.includes("/admin/")
    const navItems = [
        {
            label: "Overview",
            items: [
                { title: "Dashboard", icon: LayoutDashboard, href: `/rooms/${roomId}` },
                { title: "Schedule", icon: CalendarDays, href: `/rooms/${roomId}/schedule` },
                { title: "Announcements", icon: Bell, href: `/rooms/${roomId}/announcements` },
                { title: "Groupes", icon: Bell, href: `/rooms/${roomId}/group` },
                { title: "Messages", icon: MessageCircle, href: `/rooms/${roomId}/messages` },
                { title: "Students", icon: Users, href: `/rooms/${roomId}/students` },
            ],
        },
        {
            label: isTeacher ? "Teaching" : "Study",
            items: [
                { title: "Courses", icon: BookOpen, href: `/rooms/${roomId}/courses`, isActive: true },
                { title: "Live Sessions", icon: Video, href: `/rooms/${roomId}/live` },
                { title: "Resources", icon: FolderOpen, href: `/rooms/${roomId}/resources` },
            ],
        },
        {
            label: "Exams",
            items: [
                { title: "Assignments", icon: ClipboardList, href: `/rooms/${roomId}/assignments` },
                { title: "Exams", icon: FileText, href: `/rooms/${roomId}/exams` },
            ],
        },
    ];
    const bottomNavItems = [
        { title: "Help", icon: HelpCircle, href: "/help" },
        { title: "Settings", icon: Settings, href: `/rooms/${roomId}/settings`, teacher: true },
    ];
    return (
        <Sidebar collapsible="offcanvas" className=" border-r-0!" {...props}>
            <SidebarContent className="px-2">
                {navItems.map((section) => (
                    <SidebarGroup key={section.label} className="p-0 mt-2">
                        <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                            {section.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {section.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.href == pathname} className="h-9">
                                            <Link href={item.href}>
                                                <item.icon className="size-4 shrink-0" />
                                                <span className="text-sm">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="px-2 pb-3">
                <SidebarMenu>
                    {bottomNavItems.map((item) => {
                        if (!item.teacher) return <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className="h-9">
                                <Link href={item.href}>
                                    <item.icon className="size-4 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        if (item.teacher && isTeacher) return <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className="h-9">
                                <Link href={item.href}>
                                    <item.icon className="size-4 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    })}
                </SidebarMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none w-full justify-start px-2 py-1.5 rounded-md hover:bg-accent transition-colors">
                        <Avatar className="size-7 shrink-0">
                            <AvatarImage src={user?.avatar || ""} />
                            <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "TC"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium leading-none">{user?.name?.split(" ")[0]}</span>
                        <ChevronDown className="size-3 text-muted-foreground shrink-0 ml-auto" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">

                        <DropdownMenuItem>
                            <Settings className="size-4 mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                            <LogOut className="size-4 mr-2" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}