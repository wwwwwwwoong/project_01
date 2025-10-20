"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

// ✅ props 타입 정의
interface ProvidersProps {
    children: ReactNode;
    session?: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
    // ✅ QueryClient는 useState로 한 번만 생성 (재렌더링 방지)
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
