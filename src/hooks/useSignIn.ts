// src/hooks/useSignIn.ts
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useSignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        } else {
            router.push("/dashboard");
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        handleSubmit,
    };
}
