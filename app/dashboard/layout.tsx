import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // Protect dashboard routes
    if (!session) {
        redirect('/auth/signin')
    }

    return <>{children}</>
}
