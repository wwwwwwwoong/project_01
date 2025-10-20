import { useQuery } from "@tanstack/react-query";

export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    category: { id: string; name: string } | null;
    user: { name: string } | null;
    createdAt: string;
    updatedAt: string;
}

export interface ProductsResponse {
    data: Product[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

interface UseProductsParams {
    keyword?: string;
    categoryId?: string;
    page?: number;
    pageSize?: number;
}

export function useProducts({
    keyword = "",
    categoryId = "",
    page = 1,
    pageSize = 10,
}: UseProductsParams = {}) {
    return useQuery<ProductsResponse, Error>({
        queryKey: ["products", { keyword, categoryId, page, pageSize }],
        queryFn: async (): Promise<ProductsResponse> => {
            const params = new URLSearchParams({
                keyword,
                categoryId,
                page: String(page),
                pageSize: String(pageSize),
            });
            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "상품 조회 실패");
            return data;
        },
        staleTime: 1000, // 1초 동안 캐시 유지
    });
}
