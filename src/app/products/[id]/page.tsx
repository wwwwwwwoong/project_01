"use client";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProduct";
import ProductDetail from "@/components/ProductDetail";

const ProductPage = () => {
    const params = useParams();
    const router = useRouter();


    if (!params.id) return <p>상품 ID가 없습니다.</p>;

    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { data, isLoading, error, updateProduct, deleteProduct } = useProduct(id);

    if (isLoading) return <p>로딩 중...</p>;
    if (error) return <p>에러 발생: {error.message}</p>;
    if (!data) return <p>상품을 찾을 수 없습니다.</p>;

    const handleUpdate = (updatedData: any) => {
        updateProduct.mutate(updatedData);
    };

    const handleDelete = () => {
        deleteProduct.mutate(undefined, {
            onSuccess: () => router.push("/products"),
        });
    };

    return <ProductDetail product={data} onUpdate={handleUpdate} onDelete={handleDelete} />;
};

export default ProductPage;
