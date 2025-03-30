import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

type SecuredPageProps = Readonly<{ children: React.ReactNode }>

export default async function SecuredPage({ children }: SecuredPageProps) {
    const session = await getServerSession(authConfig);
    if (session === null || session === undefined) return redirect("/signin");
    return <>
        {children}
    </>
}