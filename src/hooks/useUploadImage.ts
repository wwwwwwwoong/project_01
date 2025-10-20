"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function useUploadImage() {
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (
        file: File,
        bucket: string = "products",
        folder: string = ""
    ): Promise<string | null> => {
        setLoading(true);
        setError(null);
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const path = folder ? `${folder}/${fileName}` : fileName;

            // 파일 업로드
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    cacheControl: "3600",
                    upsert: true, // 이름 겹쳐도 덮어쓰기
                });

            if (uploadError) throw uploadError;

            // 업로드 후 public URL 생성
            const { data } = supabase.storage.from(bucket).getPublicUrl(path);
            if (!data?.publicUrl) throw new Error("Public URL 생성 실패");
            return data.publicUrl;

            return data.publicUrl;
        } catch (err: any) {
            console.error("이미지 업로드 에러:", err);
            setError(err.message || "이미지 업로드 실패");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { uploadImage, loading, error };
}
