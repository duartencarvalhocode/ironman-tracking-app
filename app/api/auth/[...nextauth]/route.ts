import { authConfig } from "@/lib/auth";
import NextAuth from "next-auth"

const handler = NextAuth({
    ...authConfig,
    pages: {
        signIn: "/signin"
    }
})

export { handler as GET, handler as POST }