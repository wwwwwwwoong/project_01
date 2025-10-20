import { useQuery } from "@tanstack/react-query";

export interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    category?: { name: string } | null;
    user: { name: string };
    createdAt: string;
    updatedAt: string;
}

export function useProducts() {
    return useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("상품 조회 실패");
            return res.json();
        },
    });
}
