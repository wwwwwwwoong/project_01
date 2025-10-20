"use client";

import { useProducts } from "@/hooks/useProducts";

export default function ProductList() {
    const { data: products, isLoading, error } = useProducts();

    if (isLoading) return <p>상품 불러오는 중...</p>;
    if (error) return <p>상품 불러오기 실패</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products?.map((product) => (
                <div key={product.id} className="border p-4 rounded-lg shadow">
                    {product.imageUrl && (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-40 object-cover mb-2 rounded"
                        />
                    )}
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <p className="text-sm text-gray-500">작성자: {product.user.name}</p>
                    <p className="text-sm text-gray-500">
                        카테고리: {product.category?.name || "없음"}
                    </p>
                    <p className="mt-2">{product.description}</p>
                    <p className="mt-1 font-semibold">₩{product.price.toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
