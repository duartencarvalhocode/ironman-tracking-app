import { getServerSession } from "next-auth/next";
import PageWithNavBar from "../PageWithNavBar";
import SecuredPage from "../SecuredPage";
import { authConfig } from "@/lib/auth";
import getUserWorkouts from "../actions/workout/getUserWorkouts";
import { redirect } from "next/navigation";
import { ActivityType, Workout } from "../shared/domain/workout";
import { Avatar, AvatarGroup, Box, Card, Stack } from "@mui/material";
import Grid from '@mui/material/Grid2';
import PoolIcon from '@mui/icons-material/Pool';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

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
            <Box
                sx={{ height: '100%', overflow: 'auto' }}
            >
                <Stack direction='column' spacing={2}>
                    {workouts.map((workout) =>
                        <WorkoutCard workout={workout} key={workout.id} />
                    )}
                </Stack>
            </Box>
        </PageWithNavBar>
    </SecuredPage>
}


interface WorkoutCardProps {
    workout: Workout
}

function WorkoutCard({ workout }: WorkoutCardProps) {
    const { workouts } = workout
    const isMultipleWorkout = workouts.length > 1

    if (workouts.length < 1) {
        throw Error(`Workout ${workout.id} has an invalid number of workouts`)
    }

    return <Card sx={{ padding: 2 }}>
        <Grid container>
            <Grid size={3} alignItems='center'>
                {!isMultipleWorkout &&
                    <Avatar sx={{ backgroundColor: ACTIVITY_RENDER_PROPS[workouts[0].activityType].color ?? 'blue' }}>
                        {ACTIVITY_RENDER_PROPS[workouts[0].activityType].icon}
                    </Avatar>
                }
                {isMultipleWorkout &&
                    <AvatarGroup max={3} sx={{ justifyContent: 'left' }}>
                        {workouts.map(({ activityType }) =>
                            <Avatar key={activityType} sx={{ backgroundColor: ACTIVITY_RENDER_PROPS[activityType].color ?? 'blue', width: 32, height: 32 }} sizes="small">
                                {ACTIVITY_RENDER_PROPS[activityType].icon}
                            </Avatar>
                        )}
                    </AvatarGroup>
                }
            </Grid>
            <Grid size={9} alignContent='center'>
                {workout.title}
            </Grid>
        </Grid>
    </Card>
}

export interface ActivityRenderProps {
    icon: any
    color: string
    header: string
}

const ACTIVITY_RENDER_PROPS: Record<ActivityType, ActivityRenderProps> = {
    [ActivityType.Swim]: {
        icon: <PoolIcon />,
        color: 'blue',
        header: 'swim'
    },
    [ActivityType.Run]: {
        icon: <DirectionsRunIcon />,
        color: 'green',
        header: 'run'
    },
    [ActivityType.Cycle]: {
        icon: <DirectionsBikeIcon />,
        color: 'orange',
        header: 'cycle'
    },
}