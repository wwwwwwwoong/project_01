// src/app/auth/signup/page.tsx
"use client";

import SignUpForm from "@/components/SignUpForm";

export default function SignUpPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <SignUpForm />
        </div>
    );
}
