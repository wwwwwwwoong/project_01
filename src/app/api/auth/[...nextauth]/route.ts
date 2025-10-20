import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                // 비밀번호 확인 (bcrypt)
                const isValid = await compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role as "user" | "admin",
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 7, // 7일
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },

    pages: {
        signIn: "/auth/signin",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    name: token.name,
                    email: token.email,
                    role: token.role,
                };
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
