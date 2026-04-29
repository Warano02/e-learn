import AccountManagement from "@/components/user/settings/AccountManagement"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Update Password - IW"
}
function Password() {
    return <AccountManagement />
}

export default Password