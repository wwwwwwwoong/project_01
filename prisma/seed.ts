import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 추가 및 업데이트할 카테고리 정의
const categoriesToSync = [
    { name: "전체" },
    { name: "의류" },
    { name: "전자제품" },
    { name: "생활용품" },
];

async function main() {
    for (const cat of categoriesToSync) {
        const existing = await prisma.category.findFirst({ where: { name: cat.name } });

        if (existing) {
            // 이미 존재하면 업데이트 (여기서는 이름만 있지만, 필요시 다른 속성도 업데이트 가능)
            await prisma.category.update({
                where: { id: existing.id },
                data: cat,
            });
            console.log(`카테고리 업데이트: ${cat.name}`);
        } else {
            // 존재하지 않으면 새로 생성
            await prisma.category.create({ data: cat });
            console.log(`카테고리 생성: ${cat.name}`);
        }
    }

    console.log("카테고리 동기화 완료!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
