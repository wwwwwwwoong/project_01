// src/components/SignInForm.tsx
"use client";

import { useSignIn } from "@/hooks/useSignIn";

export default function SignInForm() {
    const { email, setEmail, password, setPassword, error, handleSubmit } = useSignIn();

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
        >
            <h1 className="text-2xl font-bold text-center">로그인</h1>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
                type="submit"
                className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
                로그인
            </button>
        </form>
    );
}
