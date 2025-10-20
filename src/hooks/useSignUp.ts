// src/hooks/useSignUp.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

interface SignUpForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "비밀번호는 8자 이상이어야 합니다.";
    if (!hasUpperCase) return "비밀번호에 대문자가 포함되어야 합니다.";
    if (!hasLowerCase) return "비밀번호에 소문자가 포함되어야 합니다.";
    if (!hasNumber) return "비밀번호에 숫자가 포함되어야 합니다.";
    if (!hasSpecialChar) return "비밀번호에 특수문자가 포함되어야 합니다.";
    return null; // 문제 없음
};

export function useSignUp() {
    const router = useRouter();
    const [form, setForm] = useState<SignUpForm>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const mutation = useMutation({
        mutationFn: async (form: SignUpForm) => {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "회원가입 실패");
            return data;
        },
        onSuccess: () => {
            alert("회원가입 완료!");
            router.push("/auth/signin");
        },
        onError: (error: any) => {
            alert(error.message || "회원가입 실패");
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");
            return;
        }

        const passwordError = validatePassword(form.password);
        if (passwordError) {
            alert(passwordError);
            return;
        }

        mutation.mutate(form);
    };

    return {
        form,
        handleChange,
        handleSubmit,
        loading: mutation.isPending,
    };
}
