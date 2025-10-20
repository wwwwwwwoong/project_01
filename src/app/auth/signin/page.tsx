// src/app/signin/page.tsx
"use client";

import SignInForm from "@/components/SignInForm";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <SignInForm />
        </div>
    );
}
