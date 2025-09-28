"use client"

import { Avatar, Button, Card, FormControl, IconButton, InputAdornment, InputLabel, NativeSelect, Stack, SvgIconTypeMap, Typography } from "@mui/material"
import TextField from "@mui/material/TextField"
import dayjs from "dayjs"
import { Control, Controller, FieldArrayWithId, useFieldArray, UseFieldArrayRemove, useForm, UseFormRegister, useWatch } from "react-hook-form"
import { DateTimePicker, MobileTimePicker } from "@mui/x-date-pickers";
import DeleteIcon from '@mui/icons-material/Delete';
import { useActionState, useEffect, useState } from "react"
import { createWorkout, CreateWorkoutActionState } from "@/app/actions/workout/create"
import { dayjsToSeconds, getFormattedPace } from "@/app/shared/utils/TimeUtils"
import { useRouter } from "next/navigation"
import { ActivityType, WorkoutFormInput } from "@/app/shared/domain/workout"
import { ActivityRenderProps } from "@/app/your-activities/page"
import PoolIcon from '@mui/icons-material/Pool';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

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



export default function WorkoutForm() {
    const router = useRouter()
    const [activeAtivity, setAtiveActivity] = useState(0)
    const { register, control, handleSubmit, watch } = useForm<WorkoutFormInput>({
        defaultValues: {
            title: "",
            description: "",
            date: dayjs(),
            workouts: [{ duration: dayjs().startOf('day'), distance: 0, activityType: ActivityType.Run }]
        }
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'workouts'
    })
    const [actionState, formAction, isPending] = useActionState<CreateWorkoutActionState, WorkoutFormInput>(createWorkout, {
        success: false,
    })
    useEffect(() => {
        if (actionState.success) {
            router.push(`/workout/${actionState.result}`);
        }
        if (actionState.error) {
            alert(actionState.error);
        }
    }, [actionState, router])
    function onAddActivityClick() {
        setAtiveActivity(fields.length)
        append({
            duration: dayjs().startOf('day'),
            distance: 0,
            activityType: ActivityType.Run
        })
    }
    function onSubmit(formData: WorkoutFormInput) {
        formAction({
            ...formData,
            workouts: formData.workouts // only send activities with more than 100m that lasted more than 1 minute
                .filter(({ duration, distance }) => distance * 1000 > 100 && dayjsToSeconds(duration) > 60)
        })
    }
    watch('workouts')
    return <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} paddingBottom={2}>
            <TextField
                fullWidth
                onFocus={() => setAtiveActivity(fields.length > 1 ? fields.length + 1 : fields.length - 1)}
                label="Title"
                variant="outlined"
                {...register('title', { required: true, maxLength: 128 })}
            />
            <TextField
                fullWidth
                label="Share more about your workout."
                variant="outlined"
                multiline
                rows={3}
                {...register('description', { maxLength: 256 })}
            />
            <Controller
                control={control}
                name='date'
                rules={{ required: true }}
                render={({ field }) => (
                    <DateTimePicker
                        label="Date"
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Stack spacing={2} sx={{ maxHeight: '390px', overflowY: 'auto' }}>
                {fields.map((field, index) => (
                    <Card key={field.id} sx={{ borderRadius: 2, padding: 2, minHeight: index === activeAtivity ? '265px' : '78px' }} onClick={() => setAtiveActivity(index)}>
                        {index === activeAtivity
                            ? <FocusedActivity index={index} control={control} register={register} field={field} remove={remove} />
                            : <UnfocusedActivity control={control} index={index} />
                        }
                    </Card>
                ))}
            </Stack>
            <Button variant="outlined" onClick={onAddActivityClick}>
                Add Workout activity
            </Button>
            <Button fullWidth type='submit' variant='contained' disabled={isPending}>
                Submit
            </Button>
        </Stack>
    </form >
}

type UnFocusedActivityProps = {
    index: number
    control: Control<WorkoutFormInput>
}

function UnfocusedActivity({ control, index }: UnFocusedActivityProps) {
    const activityType = useWatch({ control, name: `workouts.${index}.activityType` });
    const distance = useWatch({ control, name: `workouts.${index}.distance` });
    const duration = useWatch({ control, name: `workouts.${index}.duration` });
    return <Stack spacing={2} direction="row" alignItems='center'>
        <Avatar sx={{ backgroundColor: ACTIVITY_RENDER_PROPS[activityType].color }}>
            {ACTIVITY_RENDER_PROPS[activityType].icon}
        </Avatar>
        <Stack direction='column'>
            <Typography variant="caption">
                {capitalize(ACTIVITY_RENDER_PROPS[activityType].header)}
            </Typography>
            <Typography variant="h6">
                {distance} Km
            </Typography>
        </Stack>
        <Stack direction='column'>
            <Typography variant="caption">
                Duration
            </Typography>
            <Typography variant="h6">
                {duration.format("HH:mm:ss")}
            </Typography>
        </Stack>
        <Stack direction='column'>
            <Typography variant="caption">
                Pace
            </Typography>
            <Typography variant="h6">
                {distance > 0 &&
                    getFormattedPace(duration, distance)}
            </Typography>
        </Stack>
    </Stack>
}

type FocusedActivityProps = {
    index: number
    control: Control<WorkoutFormInput>
    register: UseFormRegister<WorkoutFormInput>
    field: FieldArrayWithId<WorkoutFormInput, "workouts", "id">
    remove: UseFieldArrayRemove
}

function FocusedActivity({ index, control, register, field, remove }: FocusedActivityProps) {
    return <Stack spacing={2} direction="column" paddingBottom={2}>
        <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor={`activityType-${field.activityType}`}>
                Type
            </InputLabel>
            <NativeSelect
                defaultValue={field.activityType}
                {...register(`workouts.${index}.activityType`, { required: true })}
                inputProps={{
                    name: `workouts.${index}.activityType`,
                    id: `activityType-${field.activityType}`,
                }}
            >
                {Object.values(ActivityType).map((type) => (
                    <option value={type} key={type}>{type}</option>
                ))}
            </NativeSelect>
        </FormControl>
        <Controller
            control={control}
            name={`workouts.${index}.duration`}
            rules={{ required: true }}
            render={({ field }) => (
                <MobileTimePicker
                    closeOnSelect
                    label='Activity duration'
                    views={['hours', 'minutes', 'seconds']}
                    ampm={false}
                    value={field.value}
                    onChange={field.onChange}
                />
            )}
        />
        <TextField
            fullWidth
            type="number"
            label="Distance"
            variant="outlined"
            InputProps={{
                endAdornment: <InputAdornment position="end">Km</InputAdornment>,
            }}
            {...register(`workouts.${index}.distance`, { required: true, min: 0, max: 1000 })}
        />
        <IconButton
            color="error"
            disabled={index === 0}
            onClick={() => remove(index)}>
            <DeleteIcon />
        </IconButton>
    </Stack>
}

function capitalize(something: string) {
    return something.substring(0, 1).toUpperCase() + something.substring(1)
}