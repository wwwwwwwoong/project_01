// src/components/DashboardContent.tsx
"use client";

import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardContent() {
    const { session, status, handleSignOut } = useDashboard();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>로딩 중...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>로그인이 필요합니다.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl font-bold mb-4">
                    {session.user?.name ?? "회원"}님, 환영합니다!
                </h1>
                <p className="mb-6">이곳은 로그인 후 접근 가능한 대시보드 페이지입니다.</p>

                <div className="flex gap-4">
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}
