import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CreateProductForm {
    name: string;
    price: number;
    description?: string;
    categoryId?: string;
    imageUrl?: string;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    categoryId?: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
}

interface UseCreateProductOptions {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useCreateProduct(options?: UseCreateProductOptions) {
    const queryClient = useQueryClient();

    const mutation = useMutation<Product, Error, CreateProductForm>({
        // ✅ mutationFn 매개변수 타입과 반환 타입 지정
        mutationFn: async (form: CreateProductForm) => {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "상품 등록 실패");

            return data as Product; // ✅ 반환 타입 보장
        },
        onSuccess: () => {
            // ✅ queryKey 타입 안정성을 위해 배열 형태로 전달
            queryClient.invalidateQueries({ queryKey: ["products"] });
            if (options?.onSuccess) options.onSuccess();
            // alert("상품 등록 완료!");
        },
        onError: (error: Error) => {
            if (options?.onError) options.onError(error);
            // alert(error.message || "상품 등록 실패");
        },
    });

    return mutation;
}
