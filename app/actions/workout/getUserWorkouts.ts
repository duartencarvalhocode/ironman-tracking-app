import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { QueryResult } from "pg";
import pool from "../../db/db";
import { ActivityType, Workout } from "@/app/shared/domain/workout";
import dayjs from "dayjs";
import { secondsToDayJs } from "@/app/shared/utils/TimeUtils";

export interface GetUserWorkoutsActionState {
    success: boolean
    error?: string
    result?: Workout[]
}

export default async function getUserWorkouts(id: number): Promise<GetUserWorkoutsActionState> {
    const session = await getServerSession(authConfig);

    const userId = session?.user?.id

    if (!userId) {
        return { success: false, error: 'User not authenticated.' };
    }

    const client = await pool.connect();
    const userWorkoutsResult: QueryResult<WorkoutRow> = await client.query(GET_USER_WORKOUTS_QUERY, [id])

    const workouts: Workout[] = userWorkoutsResult.rows.reduce((workoutAcc: Workout[], workoutRow: WorkoutRow) => {
        const existingWorkout = workoutAcc.find((workout) => workout.id === workoutRow.id)
        if (existingWorkout) {
            const workoutActivity = {
                activityType: workoutRow.type as ActivityType,
                distance: workoutRow.distance,
                duration: secondsToDayJs(workoutRow.duration),
            }
            return workoutAcc.map((workout) =>
                workout.id === existingWorkout.id
                    ? { ...workout, workouts: [...existingWorkout.workouts, workoutActivity] }
                    : workout
            )
        } else {
            const workout: Workout = {
                id: workoutRow.id,
                title: workoutRow.name,
                description: workoutRow.description || "",
                date: dayjs(workoutRow.date),
                workouts: [{
                    activityType: workoutRow.type as ActivityType,
                    distance: workoutRow.distance,
                    duration: secondsToDayJs(workoutRow.duration),
                }]
            }
            return [...workoutAcc, workout]
        }
    }, [])
    return {
        success: true,
        result: workouts
    }
}

type WorkoutRow = {
    id: string
    name: string
    description?: string
    date: string
    user_id: string
    type: string
    distance: number
    duration: number
    workout_id: string
}

const GET_USER_WORKOUTS_QUERY = `
SELECT W.*, WA.*
FROM triathlon.WORKOUT W
INNER JOIN triathlon.WORKOUT_ACTIVITY WA ON W.id = WA.workout_id
WHERE W.user_id = $1
ORDER BY W.date DESC;
`