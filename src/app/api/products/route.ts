import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const keyword = searchParams.get("keyword")?.trim() || "";
        const categoryId = searchParams.get("categoryId")?.trim() || "";
        const page = Number(searchParams.get("page") || 1);
        const pageSize = Number(searchParams.get("pageSize") || 10);

        const where: any = {};
        if (keyword) where.name = { contains: keyword, mode: "insensitive" };
        if (categoryId && categoryId !== "전체") where.categoryId = categoryId;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    user: { select: { name: true } },      // 작성자 이름만 가져오기
                    category: { select: { id: true, name: true } }, // 카테고리 정보
                },
                orderBy: { createdAt: "desc" },           // 최신순 정렬
                skip: (page - 1) * pageSize,             // 페이지 시작 위치
                take: pageSize,                           // 페이지당 데이터 수
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            data: products,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error("상품 조회 에러:", error);
        return NextResponse.json({ message: "서버 에러" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
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
