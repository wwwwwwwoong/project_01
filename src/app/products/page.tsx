"use client";

import ProductList from "@/components/ProductList";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProductsPage() {
    const { data: session } = useSession();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">판매 상품 목록</h1>

            {session ? (
                <div className="mb-6 text-right">
                    <Link
                        href="/products/new"
                        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                    >
                        상품 등록
                    </Link>
                </div>
            ) : (
                <p className="mb-6 text-gray-500">로그인 후 상품 등록이 가능합니다.</p>
            )}

            <ProductList />
        </div>
    );
}
