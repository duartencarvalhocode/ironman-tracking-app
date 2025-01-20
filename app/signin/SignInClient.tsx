'use client';

import { signIn } from "next-auth/react";

export default function SignInClient() {
    return (
        <div>
            <h1>Sign In</h1>
            <button onClick={() => signIn("google")}>Sign In</button>
        </div>
    );
}