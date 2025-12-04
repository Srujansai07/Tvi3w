import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    // If already authenticated, redirect to dashboard
    if (session) {
        redirect('/dashboard')
    }

    return <>{children}</>
}
