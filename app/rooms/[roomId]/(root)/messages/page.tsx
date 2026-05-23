import GroupChatPage from "@/components/classrooms/chat"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Classroom Messages - IW"
}

function MessagesClassRoom() {
  return (
    <GroupChatPage />
  )
}

export default MessagesClassRoom