import { Dayjs } from "dayjs"

export interface Workout {
    readonly id: string
    readonly title: string
    readonly description: string
    readonly date: Dayjs
    readonly workouts: WorkoutActivity[]
}

export interface WorkoutActivity {
    readonly duration: Dayjs
    readonly distance: number
    readonly activityType: ActivityType
}

export enum ActivityType {
    Swim = 'Swim',
    Cycle = 'Cycle',
    Run = 'Run',
}

export interface WorkoutFormInput {
    readonly title: string
    readonly description: string
    readonly date: Dayjs
    readonly workouts: WorkoutActivity[]
}