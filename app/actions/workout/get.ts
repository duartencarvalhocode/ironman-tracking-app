import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { QueryResult } from "pg";
import pool from "../../db/db";
import { ActivityType, Workout } from "@/app/shared/domain/workout";
import dayjs from "dayjs";
import { secondsToDayJs } from "@/app/shared/utils/TimeUtils";

export interface GetWorkoutActionState {
    success: boolean
    error?: string
    result?: Workout | null
}

export default async function getWorkout(id: string): Promise<GetWorkoutActionState> {
    const session = await getServerSession(authConfig);

    const userId = session?.user?.id

    if (!userId) {
        return { success: false, error: 'User not authenticated.' };
    }

    const client = await pool.connect();
    const workoutResult: QueryResult<WorkoutRow> = await client.query(GET_WORKOUT_QUERY, [id])

    if (workoutResult.rowCount === 0) {
        return {
            success: true,
            result: null
        }
    }

    const firstRow = workoutResult.rows[0]
    const workout: Workout = {
        id: firstRow.id,
        title: firstRow.name,
        description: firstRow.description || "",
        date: dayjs(firstRow.date),
        workouts: workoutResult.rows.map((row) => ({
            activityType: row.activityType as ActivityType,
            distance: row.distance,
            duration: secondsToDayJs(row.duration),
        })),
    }

    return {
        success: true,
        result: workout
    }
}

type WorkoutRow = {
    id: string
    name: string
    description?: string
    date: string
    user_id: string
    activityType: string
    distance: number
    duration: number
    workout_id: string
}

const GET_WORKOUT_QUERY = `
SELECT W.*, WA.*
FROM triathlon.WORKOUT W
INNER JOIN triathlon.WORKOUT_ACTIVITY WA ON W.id = WA.workout_id
WHERE W.id = $1;
`