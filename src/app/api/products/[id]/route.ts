import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: 단일 상품 조회
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                user: { select: { name: true } },       // 작성자 이름
                category: { select: { name: true } },   // 카테고리 이름
            },
        });

        if (!product) {
            return NextResponse.json({ message: "상품을 찾을 수 없습니다." }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("단일 상품 조회 에러:", error);
        return NextResponse.json({ message: "서버 에러" }, { status: 500 });
    }
}

// PUT: 단일 상품 수정
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { name, price, description, categoryId, imageUrl } = await req.json();

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: { name, price, description, categoryId, imageUrl },
            include: {
                user: { select: { name: true } },
                category: { select: { name: true } },
            },
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        console.error("상품 수정 에러:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ message: "상품을 찾을 수 없습니다." }, { status: 404 });
        }
        return NextResponse.json({ message: "서버 에러" }, { status: 500 });
    }
}

// DELETE: 단일 상품 삭제
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ message: "상품 삭제 완료" }, { status: 200 });
    } catch (error: any) {
        console.error("상품 삭제 에러:", error);
        if (error.code === "P2025") {
            return NextResponse.json({ message: "상품을 찾을 수 없습니다." }, { status: 404 });
        }
        return NextResponse.json({ message: "서버 에러" }, { status: 500 });
    }
}
