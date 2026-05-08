"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    MessageCircle,
    Settings,
    HelpCircle,
    ChevronDown,
    User,
    LogOut,
    Video,
    ClipboardList,
    FileText,
    FolderOpen,
    Bell,
    CalendarDays,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";

const bottomNavItems = [
    { title: "Help", icon: HelpCircle, href: "/help" },
    { title: "Settings", icon: Settings, href: "/settings" },
];

export default function ClassroomSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { id } = useParams<{ id: string }>();
    const { logout, user } = useAuthStore();

    const navItems = [
        {
            label: "Overview",
            items: [
                { title: "Dashboard", icon: LayoutDashboard, href: `/rooms/${id}` },
                { title: "Schedule", icon: CalendarDays, href: `/rooms/${id}/schedule` },
                { title: "Announcements", icon: Bell, href: `/rooms/${id}/announcements` },
            ],
        },
        {
            label: "Teaching",
            items: [
                { title: "Courses", icon: BookOpen, href: `/rooms/${id}/courses`, isActive: true },
                { title: "Live Sessions", icon: Video, href: `/rooms/${id}/live` },
                { title: "Assignments", icon: ClipboardList, href: `/rooms/${id}/assignments` },
                { title: "Exams", icon: FileText, href: `/rooms/${id}/exams` },
                { title: "Resources", icon: FolderOpen, href: `/rooms/${id}/resources` },
            ],
        },
        {
            label: "People",
            items: [
                { title: "Students", icon: Users, href: `/rooms/${id}/students` },
                { title: "Messages", icon: MessageCircle, href: `/rooms/${id}/messages` },
            ],
        },
    ];

    return (
        <Sidebar collapsible="offcanvas" className="!border-r-0" {...props}>
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
                                        <SidebarMenuButton asChild isActive={item.isActive} className="h-9">
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
                    {bottomNavItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className="h-9">
                                <Link href={item.href}>
                                    <item.icon className="size-4 shrink-0 text-muted-foreground" />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
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
                        <DropdownMenuLabel className="text-muted-foreground text-sm font-medium">
                            My Account
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            <User className="size-4 mr-2" />
                            Profile
                        </DropdownMenuItem>
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