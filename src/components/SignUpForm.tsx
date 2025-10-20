// src/components/SignUpForm.tsx
"use client";

import { useSignUp } from "@/hooks/useSignUp";
import Link from "next/link";

export default function SignUpForm() {
    const { form, handleChange, handleSubmit, loading } = useSignUp();

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4"
        >
            <h1 className="text-2xl font-bold text-center">회원가입</h1>

            <input
                type="text"
                name="name"
                placeholder="이름"
                value={form.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <input
                type="email"
                name="email"
                placeholder="이메일"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
            />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
                {loading ? "가입 중..." : "회원가입"}
            </button>

            <p className="text-sm text-center text-gray-600">
                이미 계정이 있나요?{" "}
                <Link href="/auth/signin" className="text-blue-600 hover:underline">
                    로그인
                </Link>
            </p>
        </form>
    );
}
