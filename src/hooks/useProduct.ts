// src/hooks/useProduct.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    categoryId?: string;
    imageUrl?: string;
    user: { name: string };
    category: { id: string; name: string };
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProductForm {
    name: string;
    price: number;
    description?: string;
    categoryId?: string;
    imageUrl?: string;
}

export function useProduct(id: string) {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery<Product, Error>({
        queryKey: ["product", id],
        queryFn: async () => {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "상품 조회 실패");
            return data;
        },
    });

    const updateProduct = useMutation<Product, Error, UpdateProductForm>({
        mutationFn: async (form) => {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "상품 수정 실패");
            return data;
        },

        // ✅ 화면 즉시 반영
        onMutate: async (updatedProduct) => {
            // 이전 상태 백업
            await queryClient.cancelQueries({ queryKey: ["product", id] });
            const previousProduct = queryClient.getQueryData<Product>(["product", id]);

            // 낙관적 업데이트 적용
            if (previousProduct) {
                queryClient.setQueryData<Product>(["product", id], {
                    ...previousProduct,
                    ...updatedProduct,
                });
            }

            return { previousProduct };
        },


        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", id] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    const deleteProduct = useMutation<void, Error, void>({
        mutationFn: async () => {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "상품 삭제 실패");
            return;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    return { data, isLoading, error, updateProduct, deleteProduct };
}
