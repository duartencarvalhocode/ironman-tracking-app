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


export function activityTypeConverter(activityType: string): ActivityType {
    switch (activityType) {
        case 'Run':
            return ActivityType.Run
        case 'Cycle':
            return ActivityType.Cycle
        case 'Swim':
            return ActivityType.Swim
        default:
            throw Error(`Invalid argument ${activityType}`)
    }
}