import ClassroomsContent from "@/components/user/dashboard/classrooms-content"
import { BookmarksHeader } from "@/components/user/dashboard/header"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "View Your Classrooms",
    description: "List of your classroom."
}

function ClassRooms() {
    return (
        <>
            <BookmarksHeader />
            <ClassroomsContent />
        </>
    )
}

export default ClassRooms