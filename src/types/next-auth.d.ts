// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email: string;
            role: "user" | "admin";
        };
    }

    interface User {
        id: string;
        name?: string | null;
        email: string;
        role: "user" | "admin";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name?: string | null;
        email: string;
        role: "user" | "admin";
    }
}
