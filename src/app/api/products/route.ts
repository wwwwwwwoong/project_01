import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                user: { select: { name: true } },      // 작성자 이름
                category: { select: { name: true } },  // 카테고리 이름
            },
        });

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("상품 조회 에러:", error);
        return NextResponse.json({ message: "서버 에러" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
        }

        const { name, price, description, categoryId, imageUrl } = await req.json();

        if (!name || !price) {
            return NextResponse.json({ message: "상품명과 가격은 필수입니다." }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                description,
                categoryId,   // FK로 연결
                imageUrl,
                userId: session.user.id,
            },
            include: {
                user: { select: { name: true } },
                category: { select: { name: true } },
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("상품 생성 에러:", error);
        return NextResponse.json({ message: "서버 에러" }, { status: 500 });
    }
}
