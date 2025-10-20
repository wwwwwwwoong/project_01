import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: 단일 상품 조회 (로그인 없이 접근 가능)
export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const { params } = context;
        const { id } = params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                user: { select: { name: true } },
                category: { select: { id: true, name: true } },
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

// ✅ 2. 상품 수정 (로그인 + 작성자만 가능)
export async function PUT(req: Request, context: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
        }

        const { params } = await context;
        const { id } = params;

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return NextResponse.json({ message: "상품을 찾을 수 없습니다." }, { status: 404 });
        }

        if (product.userId !== session.user.id) {
            return NextResponse.json({ message: "권한이 없습니다." }, { status: 403 });
        }

        const { name, price, description, categoryId, imageUrl } = await req.json();

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                // ✅ 문자열이 와도 안전하게 숫자로 변환
                price: Number(price),
                description: description || null,
                categoryId: categoryId || null,
                imageUrl: imageUrl || null,
            },
            include: {
                user: { select: { name: true } },
                category: { select: { id: true, name: true } },
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


// DELETE: 단일 상품 삭제 (로그인 + 작성자 체크)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 });
        }

        const { id } = params;
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            return NextResponse.json({ message: "상품을 찾을 수 없습니다." }, { status: 404 });
        }

        if (product.userId !== session.user.id) {
            return NextResponse.json({ message: "권한이 없습니다." }, { status: 403 });
        }

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
