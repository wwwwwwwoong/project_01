"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/useCategories";

interface SearchBarProps {
    onSearch: (keyword: string, categoryId: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const { data: categories } = useCategories();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(keyword, categoryId);
        }
    };

    const handleSearchClick = () => {
        onSearch(keyword, categoryId);
    };

    return (
        <div className="flex gap-2 mb-4">
            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="border rounded px-2 py-1"
            >
                {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력하세요"
                className="border rounded px-2 py-1 flex-1"
            />
            <button
                onClick={handleSearchClick}
                className="bg-blue-500 text-white px-4 rounded"
            >
                검색
            </button>
        </div>
    );
}
