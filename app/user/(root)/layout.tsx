import { SidebarProvider } from '@/components/ui/sidebar'
import { BookmarksSidebar } from '@/components/user/dashboard/sidebar'
import React from 'react'

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="bg-sidebar">
            <BookmarksSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}

export default Layout