"use client";
import React, { useState } from "react";
import { Product, UpdateProductForm } from "@/hooks/useProduct";
import { useCategories } from "@/hooks/useCategories";

interface ProductDetailProps {
    product: Product;
    onUpdate: (data: UpdateProductForm) => void;
    onDelete: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onUpdate, onDelete }) => {
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<UpdateProductForm>({
        name: product.name,
        price: product.price,
        description: product.description || "",
        categoryId: product.category?.id || undefined,
        imageUrl: product.imageUrl || "",
    });

    const { data: categories, isLoading: isCatLoading } = useCategories();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onUpdate(form);
        setEditing(false);
    };

    return (
        <div className="p-4 border rounded-md shadow-sm">
            {editing ? (
                <>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="border p-1 w-full mb-2"
                    />
                    <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        className="border p-1 w-full mb-2"
                    />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="border p-1 w-full mb-2"
                    />
                    {categories && (
                        <select
                            name="categoryId"
                            value={form.categoryId}
                            onChange={handleChange}
                            className="border p-1 w-full mb-2"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    )}
                    <input
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className="border p-1 w-full mb-2"
                    />
                    <button
                        onClick={handleSave}
                        className="mr-2 bg-blue-500 text-white px-2 py-1 rounded"
                    >
                        저장
                    </button>
                    <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-300 px-2 py-1 rounded"
                    >
                        취소
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <p>가격: {product.price}원</p>
                    <p>설명: {product.description || "없음"}</p>
                    <p>작성자: {product.user?.name || "알 수 없음"}</p>
                    <p>카테고리: {product.category?.name || "없음"}</p>
                    {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.name} className="mt-2 max-w-xs" />
                    )}
                    <div className="mt-2">
                        <button
                            onClick={() => setEditing(true)}
                            className="mr-2 bg-green-500 text-white px-2 py-1 rounded"
                        >
                            수정
                        </button>
                        <button
                            onClick={onDelete}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            삭제
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductDetail;
