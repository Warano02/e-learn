import { Metadata } from "next"
import { CalendarSidebar } from "@/components/classrooms/calendar/calendar-sidebar";
import { CalendarHeader } from "@/components/classrooms/calendar/calendar-header";
import { CalendarControls } from "@/components/classrooms/calendar/calendar-controls";
import { CalendarView } from "@/components/classrooms/calendar/calendar-view";
export const metadata: Metadata = {
  title: "Schedule some event  - IW"
}

function Schedule() {
  return (
    <div className="h-svh overflow-hidden lg:p-2 w-full">
            <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full bg-background">
              <div className="w-full">
                <CalendarHeader />
                <CalendarControls />
              </div>
              <div className="flex-1 overflow-hidden w-full">
                <CalendarView />
              </div>
            </div>
          </div>
  )
}

export default Schedule