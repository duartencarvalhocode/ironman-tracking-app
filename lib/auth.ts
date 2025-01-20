import { getServerSession, NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export const authConfig: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ]
}

export async function loginIsRequiredServer() {
    const session = await getServerSession(authConfig);
    if (!session) return redirect("/");
}

// export function loginIsRequiredClient() {
//     if (typeof window !== "undefined") {
//         const session = useSession();
//         const router = useRouter();
//         if (!session) router.push("/");
//     }
// }