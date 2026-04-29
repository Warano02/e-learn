"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Megaphone,
  Layers,
  Users,
  MessageCircle,
  Wallet,
  Folder,
  Plus,
  HelpCircle,
  Settings,
  ChevronDown,
  User,
  Search,
  LogOut,
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
import { cn } from "@/lib/utils";
import { folders } from "@/mock-data/creator-dashboard";
import { useAuthStore } from "@/store/auth.store";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "#" },
  { title: "Campaigns", icon: Megaphone, href: "#", isActive: true },
  { title: "Projects", icon: Layers, href: "#" },
  { title: "Team", icon: Users, href: "#" },
  { title: "Messages", icon: MessageCircle, href: "#" },
  { title: "Wallet", icon: Wallet, href: "#" },
];

const bottomNavItems = [
  { title: "Help", icon: HelpCircle, href: "#" },
  { title: "Settings", icon: Settings, href: "#" },
];

export function DashboardSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const { logout, user } = useAuthStore()
  return (
    <Sidebar collapsible="offcanvas" className="!border-r-0" {...props}>
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center justify-between w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none w-full justify-start">
              <Avatar className="size-7.5 shrink-0">
                <AvatarImage src={user?.avatar || ''} />
                <AvatarFallback>{user?.name.slice(2).toLocaleUpperCase() || "UN"} </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user?.name.split(" ")[0]} </span>
              <ChevronDown className="size-3 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Classrooms
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Avatar className="size-5 mr-2 shrink-0">
                  <AvatarImage src="https://api.dicebear.com/9.x/glass/svg?seed=creator" />
                  <AvatarFallback>CR</AvatarFallback>
                </Avatar>
                Creator Hub
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="size-5 rounded bg-blue-500/20 mr-2 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
                  M
                </div>
                Marketing Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Plus className="size-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="size-4 mr-2" />
                Profile
              </DropdownMenuItem>
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
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className="h-9"
                  >
                    <Link href={item.href}>
                      <item.icon
                        className="size-4 shrink-0"
                      />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="p-0 mt-2">
          <div className="flex items-center justify-between px-2 py-1">
            <SidebarGroupLabel className="px-0 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Folders
            </SidebarGroupLabel>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-5">
                <Search className="size-3" />
              </Button>
              <Button variant="ghost" size="icon" className="size-5">
                <Plus className="size-3" />
              </Button>
            </div>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  <SidebarMenuButton asChild className="h-8">
                    <Link href="#">
                      <Folder className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-sm">{folder.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-8">
                  <Link href="#">
                    <Plus className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">New folder</span>
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
