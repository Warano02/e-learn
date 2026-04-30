import { Metadata } from "next"

export const metadata: Metadata = {
    title: "ClassRoom - IW"
}
function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}

export default layout