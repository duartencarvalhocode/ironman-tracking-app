import { authConfig, loginIsRequiredServer } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignOut from "./SignOut";

export default async function Home() {
  const session = await getServerSession(authConfig);
  if (session === null || session === undefined) return redirect("/signin");
  console.log(session)
  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
      <p>Email: {session.user?.email}</p>
      <SignOut />
    </div >
  );
}
