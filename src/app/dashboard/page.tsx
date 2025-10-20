// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardContent from "@/components/DashboardContent";
import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // ✅ 로그인하지 않은 경우, 서버에서 바로 리다이렉트
    if (!session) {
        redirect("/auth/signin");
    }

    return (


        <div className="min-h-screen p-10">
            <h1 className="text-3xl font-bold text-center mb-6">판매자 대시보드</h1>

            {/* ✅ 상품 등록 폼 */}
            <ProductForm categories={[]} />

            <hr className="my-10 border-gray-300" />

            {/* ✅ 전체 상품 목록 */}
            <ProductList />

            <DashboardContent />;
        </div>
    );
}
