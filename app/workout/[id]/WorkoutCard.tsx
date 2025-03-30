import { Workout } from "@/app/shared/domain/workout"
import { Stack, Typography } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"

interface WorkoutCardProps {
    workout: Workout
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {

    const formattedDate = workout.date.format('YYYY-MM-DDHH:mm')
    const formattedTime = workout.date.format('HH:mm')
    const formattedDateTime = `${formattedDate} at ${formattedTime}`

    return <Stack direction='column' spacing={2}>
        <WorkoutValueAndLabel value={workout.title} label="TITLE" />
        <WorkoutValueAndLabel value={formattedDateTime} label="DATE" />
        <WorkoutValueAndLabel value={formattedDateTime} label="DATE" />
    </Stack>
}

interface WorkoutValueAndLabelProps {
    value: string
    label: string
}

function WorkoutValueAndLabel({ value, label }: WorkoutValueAndLabelProps) {
    return <Stack direction='column' spacing={0.5}>
        <Typography variant='body2' fontWeight='bold'>
            {label}
        </Typography>
        <Typography variant='h5'>
            {value}
        </Typography>
    </Stack>
}