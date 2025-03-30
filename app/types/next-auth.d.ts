// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id?: number;
    }
    interface Session {
        user: {
            id?: number;
            email?: string | null;
            name?: string | null;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: number;
    }
}