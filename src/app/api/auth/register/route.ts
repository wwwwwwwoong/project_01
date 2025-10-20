import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, password, confirmPassword } = await req.json();

        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json({ message: "모든 필드를 입력해주세요." }, { status: 400 });
        }

        // 비밀번호 확인
        if (password !== confirmPassword) {
            return NextResponse.json({ message: "비밀번호가 일치하지 않습니다." }, { status: 400 });
        }

        // (간단한) 이메일 포맷 체크
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ message: "유효한 이메일을 입력해주세요." }, { status: 400 });
        }

        // 비밀번호 최소 길이 체크
        if (password.length < 8) {
            return NextResponse.json({ message: "비밀번호는 최소 8자 이상이어야 합니다." }, { status: 400 });
        }

        // 기존 사용자 확인 (optional — race 조건 대비로 create 에러도 처리)
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ message: "이미 가입된 이메일입니다." }, { status: 400 });
        }

        const saltRounds = Number(process.env.BCRYPT_ROUNDS ?? 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 유저 생성 — 반환 필드 제한 (비밀번호 제외)
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "user",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ message: "회원가입 완료", user: newUser }, { status: 201 });
    } catch (error: any) {
        console.error("회원가입 에러:", error);

        // Prisma 고유 제약 위반 예시 처리 (에러 코드 P2002)
        if (error?.code === "P2002") {
            return NextResponse.json({ message: "이미 가입된 이메일입니다." }, { status: 400 });
        }

        return NextResponse.json({ message: "서버 에러" }, { status: 500 });
    }
}
