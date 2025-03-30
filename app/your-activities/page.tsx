import { getServerSession } from "next-auth/next";
import PageWithNavBar from "../PageWithNavBar";
import SecuredPage from "../SecuredPage";
import { authConfig } from "@/lib/auth";
import getUserWorkouts from "../actions/workout/getUserWorkouts";
import { redirect } from "next/navigation";
import { ActivityType, Workout } from "../shared/domain/workout";
import { Avatar, Card, Stack } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { ACTIVITY_RENDER_PROPS } from "../new-workout/components/WorkoutForm";

export default async function SignInPage() {

    const session = await getServerSession(authConfig);

    if (!session) {
        return redirect("/signin");
    }
    const workoutsResults = await getUserWorkouts(session.user.id!)

    const workouts = workoutsResults.result ?? []

    return <SecuredPage>
        <PageWithNavBar path="/your-activities">
            <h1>Your activities</h1>
            <Stack direction='column' spacing={2}>
                {workouts.map((workout) =>
                    <WorkoutCard workout={workout} key={workout.id} />
                )}
            </Stack>
        </PageWithNavBar>
    </SecuredPage>
}


interface WorkoutCardProps {
    workout: Workout
}

function WorkoutCard({ workout }: WorkoutCardProps) {
    const { workouts } = workout
    const type = workouts[0].activityType as ActivityType
    console.log(ACTIVITY_RENDER_PROPS, type, ACTIVITY_RENDER_PROPS[type])
    return <Card sx={{ padding: 2 }}>
        <Grid container>
            <Grid size={3}>
                {/* <Avatar sx={{ backgroundColor: ACTIVITY_RENDER_PROPS[type].color ?? 'blue' }}>
                    {ACTIVITY_RENDER_PROPS[type].icon}
                </Avatar> */}
            </Grid>
            <Grid size={9}>
                {workout.title}
            </Grid>
        </Grid>
    </Card>
}