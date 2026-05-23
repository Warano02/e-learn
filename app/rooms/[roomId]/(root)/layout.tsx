import ClassroomSidebar from "@/components/dashboard/rooms/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="bg-sidebar">
            <ClassroomSidebar />
            <div className="h-svh overflow-hidden lg:p-2 w-full">
                <div className="lg:border lg:rounded-md overflow-hidden flex flex-col h-full w-full bg-background">
                    <main className="w-full flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default layout