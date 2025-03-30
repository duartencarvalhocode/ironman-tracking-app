import ReturnButton from "@/app/new-workout/components/ReturnButton";
import PageWithNavBar from "@/app/PageWithNavBar";
import SecuredPage from "@/app/SecuredPage";
import { Paper, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import WorkoutCard from "./WorkoutCard";
import getWorkout from "@/app/actions/workout/get";

interface WorkoutPageProps {
    params: { id: string }
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
    const { id } = await params

    const workoutResult = await getWorkout(id)

    if (!workoutResult || !workoutResult.result) {
        throw Error(`Workout ${id} not found.`)
    }

    return <SecuredPage>
        <PageWithNavBar path={`/workout/`}>
            <Paper elevation={3} sx={{ marginTop: 2 }}>
                <Stack direction='column' spacing={3} paddingX={2}>
                    <Grid container spacing={2}>
                        <Grid size={10} paddingTop={2}>
                            <Typography variant="h4">Your new workout</Typography>
                        </Grid>
                        <Grid size={2} alignContent='center' textAlign='right'>
                            <ReturnButton />
                        </Grid>
                    </Grid>
                    <WorkoutCard workout={workoutResult.result} />
                </Stack>
            </Paper>
        </PageWithNavBar>
    </SecuredPage>
}