'use server'

import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { QueryResult, PoolClient } from 'pg';
import pool from "../../db/db";
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod';
import { dayjsToSeconds } from "../../shared/utils/TimeUtils";
import { WorkoutFormInput } from "@/app/shared/domain/workout";


const workoutSchema = z.object({
    title: z.string().min(3, "Workout title is required"),
    description: z.string().optional(),
    date: z.string().datetime(),
    workouts: z.array(
        z.object({
            activityType: z.enum(["Swim", "Cycle", "Run"]),
            distance: z.string().regex(/^\d+(\.\d+)?$/, "Distance must be a number"),
            duration: z.string().datetime(),
        })
    ).min(1, "You must include at least one workout activity"),
});

export type ActionResult = Promise<{ success: boolean; error?: string, result?: string }>
export interface CreateWorkoutActionState {
    success: boolean;
    error?: string;
    result?: string;
}

export async function createWorkout(state: CreateWorkoutActionState, createWorkoutForm: WorkoutFormInput): Promise<CreateWorkoutActionState> {
    const session = await getServerSession(authConfig);
    const userId = session?.user?.id

    if (!userId) {
        return { success: false, error: 'User not authenticated.' };
    }

    const validation = workoutSchema.safeParse(createWorkoutForm);
    if (!validation.success) {
        return {
            success: false,
            error: `Invalid workout: ${validation.error.issues.map(issue => issue.message).join(", ")}`
        }
    }
    try {
        const workoutId = await transactionalQuery(async (client: PoolClient) => {

            const { title, description, date, workouts } = validation.data;

            const workoutId = uuidv4()
            const workoutFields = [workoutId, title, description, date, userId]

            // Insert workout entry
            const newWorkoutResult: QueryResult = await client.query(INSERT_WORKOUT_QUERY, workoutFields)

            if (newWorkoutResult.rowCount !== 1) {
                throw new Error('Failed to insert workout');
            }

            // insert workout activities
            for (const { activityType, distance, duration } of workouts) {
                const workoutDuration = dayjsToSeconds(duration)
                const wokoutDistance = parseFloat(distance) * 1000
                const workoutParams = [activityType, wokoutDistance, workoutDuration, workoutId]
                const newWorkoutActivityResult = await client.query(INSERT_WORKOUT_ACTIVITY_QUERY, workoutParams)
                if (newWorkoutActivityResult.rowCount !== 1) {
                    throw new Error('Failed to insert workout activity');
                }
            }
            return workoutId
        })
        return { success: true, result: workoutId };
    } catch (error) {
        return { success: false, error: 'Server error' };
    }
}

const INSERT_WORKOUT_QUERY = `
    INSERT INTO triathlon.WORKOUT (id, name, description, date, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
`;

const INSERT_WORKOUT_ACTIVITY_QUERY = `
    INSERT INTO triathlon.WORKOUT_ACTIVITY (type, distance, duration, workout_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
`;

async function transactionalQuery<T>(transaction: (client: PoolClient) => Promise<T>) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const data = await transaction(client)

        await client.query('COMMIT');

        return data
    } catch (error) {
        console.log('Transaction failed. Rolling back!')
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}