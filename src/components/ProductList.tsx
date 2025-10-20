"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";

export default function ProductList() {
    const [searchParams, setSearchParams] = useState({ keyword: "", categoryId: "" });
    const { data, isLoading, error } = useProducts({
        keyword: searchParams.keyword,
        categoryId: searchParams.categoryId,
    });

    const router = useRouter();

    return (
        <div>
            <SearchBar onSearch={(keyword, categoryId) => setSearchParams({ keyword, categoryId })} />

            {isLoading && <p>상품 불러오는 중...</p>}
            {error && <p>상품 불러오기 실패: {error.message}</p>}
            {!data?.data.length && <p>상품이 없습니다.</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.data.map((product) => (
                    <div
                        key={product.id}
                        className="border p-4 rounded-lg shadow cursor-pointer hover:shadow-lg"
                        onClick={() => router.push(`/products/${product.id}`)}
                    >
                        {product.imageUrl && (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-40 object-cover mb-2 rounded"
                            />
                        )}
                        <h2 className="text-lg font-bold">{product.name}</h2>
                        <p className="text-sm text-gray-500">작성자: {product.user?.name || "없음"}</p>
                        <p className="text-sm text-gray-500">카테고리: {product.category?.name || "없음"}</p>
                        <p className="mt-2">{product.description}</p>
                        <p className="mt-1 font-semibold">₩{product.price.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
