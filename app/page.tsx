import { getServerSession } from "next-auth";
import PageWithNavBar from "./PageWithNavBar";
import SecuredPage from "./SecuredPage";
import SignOut from "./SignOut";
import { authConfig } from "@/lib/auth";
import { Typography } from "@mui/material";

export default async function Home() {
  const session = await getServerSession(authConfig);
  return (
    <SecuredPage>
      <PageWithNavBar path="/">
        <Typography variant="h5">
          Welcome, {session?.user?.name}!
        </Typography>
        <p>Email: {session?.user?.email}</p>
        <SignOut />
      </PageWithNavBar>
    </SecuredPage>
  );
}
