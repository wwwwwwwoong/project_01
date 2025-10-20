"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useCreateProduct, CreateProductForm } from "@/hooks/useCreateProduct";
import { useCategories, Category } from "@/hooks/useCategories";
import { useRouter } from "next/navigation";

export default function ProductForm() {
    const { data: categories, isLoading: isCategoriesLoading, error: categoriesError } = useCategories();
    const router = useRouter();
    const initialForm: CreateProductForm = {
        name: "",
        price: 0,
        description: undefined,
        categoryId: undefined,
        imageUrl: undefined,
    };

    const [form, setForm] = useState<CreateProductForm>(initialForm);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

    const createProduct = useCreateProduct({
        onSuccess: () => {
            setSuccessMessage("상품 등록 완료!");
            setErrorMessage(null);
            setForm(initialForm);
            setImagePreview(undefined);

            router.push("/products");
        },
        onError: (error: any) => {
            setErrorMessage(error.message || "상품 등록 실패");
            setSuccessMessage(null);
        },
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === "imageUrl" && files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            setForm(prev => ({ ...prev, imageUrl: file.name })); // 서버 업로드 시 파일 처리 필요
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: name === "price" ? Number(value) : value || undefined,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        createProduct.mutate(form);
    };

    if (isCategoriesLoading) return <p>카테고리 불러오는 중...</p>;
    if (categoriesError) return <p>카테고리 불러오기 실패: {categoriesError.message}</p>;

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow space-y-4">
            <h1 className="text-2xl font-bold text-center">상품 등록</h1>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

            <input type="text" name="name" placeholder="상품명" value={form.name || ""} onChange={handleChange} required className="w-full border p-2 rounded" />

            <input type="number" name="price" placeholder="가격을 입력하세요" value={form.price} onChange={handleChange} min={0} required className="w-full border p-2 rounded" />

            <textarea name="description" placeholder="상품 설명" value={form.description || ""} onChange={handleChange} className="w-full border p-2 rounded" />

            <select name="categoryId" value={form.categoryId || ""} onChange={handleChange} className="w-full border p-2 rounded" required>
                {categories?.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

            <input type="file" name="imageUrl" accept="image/*" onChange={handleChange} className="w-full border p-2 rounded" />
            {imagePreview && <img src={imagePreview} alt="미리보기" className="w-32 h-32 object-cover mt-2 rounded" />}

            <button type="submit" disabled={createProduct.isPending} className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50">
                {createProduct.isPending ? "등록 중..." : "상품 등록"}
            </button>
        </form>
    );
}
