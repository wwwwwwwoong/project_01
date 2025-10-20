// src/hooks/useDashboard.ts
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useDashboard() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleSignOut = () => {
        signOut({ callbackUrl: "/auth/signin" });
    };

    return {
        session,
        status,
        handleSignOut,
    };
}
