import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import pool from '@/app/db/db'
import { QueryResult } from "pg";



export const authConfig: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async signIn({ user }) {
            const client = await pool.connect()
            if (!user.email) {
                throw new Error('Email has to be defined')
            }
            const email = user.email
            const firstName = user.name?.split(' ')[0] || null
            const lastName = user.name?.split(' ').slice(1).join(' ') || null
            try {
                const userQueryResult: QueryResult = await client.query(USER_QUERY, [email])
                if (userQueryResult.rowCount === 0) {
                    // User doesn't exist, insert new
                    const newUserResult = await client.query(INSERT_USER_QUERY, [email, firstName, lastName])
                    if (newUserResult.rowCount !== 1) {
                        console.error('Insert should have returned 1 row')
                        return false
                    }
                }
                return true
            } catch (error) {
                console.error('SignIn callback error:', error)
                return false
            } finally {
                client.release()
            }
        },
        async jwt({ token, user }) {
            if (user?.email) {
                const client = await pool.connect();
                try {
                    const res = await client.query(USER_QUERY, [user.email]);
                    token.id = res.rows[0]?.id;
                }
                catch (error) {
                    console.log('Could not query user id from db')
                    throw error
                }
            }
            return token;
        },
        async session({ session, token }) {
            // console.log({ session, token, user })
            session.user.id = token.id as number;
            return session;
        },
    }
}

const USER_QUERY = 'SELECT id FROM triathlon.USERS WHERE email = $1 LIMIT 1'
const INSERT_USER_QUERY = `
    INSERT INTO triathlon.USERS (email, firstName, lastName)
    VALUES ($1, $2, $3)
    RETURNING id
`