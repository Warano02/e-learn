import HelpAndSecurity from "@/components/user/settings/help"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Help Security - IW"
}
function page() {
    return <HelpAndSecurity />

}

export default page