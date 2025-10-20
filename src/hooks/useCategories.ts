// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";

export interface Category {
    id: string;
    name: string;
}

export function useCategories() {
    const { data, isLoading, error } = useQuery<Category[], Error>({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await fetch("/api/categories");
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "카테고리 조회 실패");
            return data;
        },
    });

    return { data, isLoading, error };
}
