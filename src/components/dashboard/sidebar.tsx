"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageCircle,
  BarChart2,
  Settings,
  HelpCircle,
  Plus,
  Search,
  ChevronDown,
  User,
  LogOut,
  Video,
  FolderOpen,
  GraduationCap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
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
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useBookmarksStore } from "@/store/bookmarks-store";
import { useUserSocket } from "@/store/user-io.store";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "My Courses", icon: BookOpen, href: "/admin/courses", isActive: true },
  { title: "Students", icon: Users, href: "/admin/students" },
  { title: "Virtual Rooms", icon: Video, href: "/admin/rooms" },
  { title: "Messages", icon: MessageCircle, href: "/admin/messages" },
];

const bottomNavItems = [
  { title: "Help", icon: HelpCircle, href: "/admin/help" },
  { title: "Settings", icon: Settings, href: "/admin/settings" },
];

const recentCourses = [
  "Introduction to AI",
  "Python for Beginners",
  "UX Design Basics",
];

export default function adminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { logout, user } = useAuthStore();
    const pathname = usePathname();
  const { initSocket, disconnectSocket } = useUserSocket()
  return (
    <Sidebar collapsible="offcanvas" className="border-r-0!" {...props}>
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center justify-between w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none w-full justify-start">
              <Avatar className="size-7.5 shrink-0">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "TC"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium leading-none">{user?.name?.split(" ")[0]}</span>

              </div>
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
          <Button variant="ghost" size="icon" className="size-7 shrink-0">
            <Search className="size-3.5" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname==item.href} className="h-9">
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

        <SidebarGroup className="p-0 mt-4">
          <div className="flex items-center justify-between px-2 py-1">
            <SidebarGroupLabel className="px-0 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent Courses
            </SidebarGroupLabel>
            <Button variant="ghost" size="icon" className="size-5">
              <Plus className="size-3" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentCourses.map((course) => (
                <SidebarMenuItem key={course}>
                  <SidebarMenuButton asChild className="h-8">
                    <Link href="#">
                      <BookOpen className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-sm truncate">{course}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-8">
                  <Link href="/admin/courses/new">
                    <Plus className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">New course</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
      </SidebarFooter>
    </Sidebar>
  );
}