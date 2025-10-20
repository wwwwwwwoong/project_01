import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: SECRET });
    const url = req.nextUrl.clone();

    // 로그인 체크
    if (!token) {
        if (
            url.pathname.startsWith("/dashboard") ||
            url.pathname.startsWith("/products") ||
            url.pathname.startsWith("/admin")
        ) {
            url.pathname = "/auth/signin";
            return NextResponse.redirect(url);
        }
    }

    // Role 체크 (관리자 전용)
    if (token && url.pathname.startsWith("/admin")) {
        if (token.role !== "admin") {
            url.pathname = "/unauthorized"; // 접근 권한 없을 때 페이지
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/products/:path*",
        "/admin/:path*"
    ],
};
