"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  MessageSquare,
  UserPlus,
  Command,
  MoreVertical,
  ChartArea,
  Settings,
  Check,
  Mail,
  Archive,
  Users,
  Link2,
  Copy,
} from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 border-b bg-card sticky top-0 z-10 w-full">
      <SidebarTrigger className="-ml-1 sm:-ml-2" />

      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <ChartArea className="size-5 sm:size-6 text-muted-foreground hidden sm:block" />
        <h1 className="text-base sm:text-lg font-medium truncate">Students</h1>
      </div>

      <div className="hidden md:block relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <Input
          placeholder="Search Anything..."
          className="pl-10 pr-14 w-45 lg:w-55 h-9 bg-card border"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-muted px-1 py-0.5 rounded text-xs text-muted-foreground">
          <Command className="size-3" />
          <span>K</span>
        </div>
      </div>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8">
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuItem>
            <Search className="size-4 mr-2" />
            Search
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell className="size-4 mr-2" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageSquare className="size-4 mr-2" />
            Messages
          </DropdownMenuItem>
         
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
