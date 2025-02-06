// src/app/(protected)/admin/users/page.tsx
"use client"

import { auth } from "@/auth";
import { Session } from "inspector/promises";

const AdminPage = async () => {
    const session = await auth();

    if (!session) {
        return <div>Not authenticated</div>
    }

    if(session?.user?.role !== 'admin') {
        return <div>Not authorized</div>
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}