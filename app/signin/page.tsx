
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import SignInClient from "./SignInClient";
import { redirect } from "next/navigation";
export default async function SignInPage() {
    const session = await getServerSession(authConfig);
    if (session) {
        return redirect("/");
    }

    // Render the client-side component if no session exists
    return <SignInClient />;
}