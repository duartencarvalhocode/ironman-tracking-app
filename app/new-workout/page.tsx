import { Paper, Stack, Typography } from "@mui/material";
import PageWithNavBar from "../PageWithNavBar";
import SecuredPage from "../SecuredPage";
import Grid from '@mui/material/Grid2';
import ReturnButton from "./components/ReturnButton";
import WorkoutForm from "./components/WorkoutForm";

export default async function NewWorkoutPage() {

    return <SecuredPage>
        <PageWithNavBar path="/new-workout">
            <Paper elevation={3} sx={{ marginTop: '16px' }}>
                <Stack direction='column' spacing={3} paddingX='16px'>
                    <Grid container spacing={2}>
                        <Grid size={10} paddingTop={2}>
                            <Typography variant="h4">New workout</Typography>
                        </Grid>
                        <Grid size={2} alignContent='center' textAlign='right'>
                            <ReturnButton />
                        </Grid>
                    </Grid>
                    <WorkoutForm />
                </Stack>
            </Paper>
        </PageWithNavBar>
    </SecuredPage>
}