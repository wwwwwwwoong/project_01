"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
    categoryName?: string;
    user: { name: string };
}

// 🟢 단일 조회 (GET /products/:id)
export function useProduct(id: string) {
    return useQuery<Product>({
        queryKey: ["products", id],
        queryFn: async () => {
            const res = await fetch(`/api/products/${id}`);
            if (!res.ok) throw new Error("상품 조회 실패");
            return res.json();
        },
        enabled: !!id, // id가 있을 때만 실행
    });
}

// 🟢 추가 (POST /products)
export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Product>) => {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("상품 추가 실패");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]); // 캐시 갱신
        },
    });
}

// 🟢 수정 (PUT /products/:id)
export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Product) => {
            const res = await fetch(`/api/products/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("상품 수정 실패");
            return res.json();
        },
        onSuccess: (_, data) => {
            queryClient.invalidateQueries(["products"]); // 목록 갱신
            queryClient.invalidateQueries(["products", data.id]); // 단일 상품 갱신
        },
    });
}

// 🟢 삭제 (DELETE /products/:id)
export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("상품 삭제 실패");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["products"]); // 목록 갱신
        },
    });
}
