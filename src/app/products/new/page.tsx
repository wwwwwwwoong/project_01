// src/app/dashboard/page.tsx

import ProductForm from "@/components/ProductForm";


export default async function ProductFormPage() {


    // ✅ 로그인하지 않은 경우, 서버에서 바로 리다이렉트

    return (


        <div className="min-h-screen p-10">


            {/* ✅ 상품 등록 폼 */}
            <ProductForm />

        </div>
    );
}
