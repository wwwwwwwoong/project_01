// src/app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            select: { id: true, name: true }, // id, name만 가져오기
        });
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("카테고리 조회 에러:", error);
        return NextResponse.json({ message: "서버 에러" }, { status: 500 });
    }
}
