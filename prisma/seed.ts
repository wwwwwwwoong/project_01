import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: "의류" },
        { name: "전자제품" },
        { name: "생활용품" },
    ];

    for (const cat of categories) {
        const exists = await prisma.category.findFirst({
            where: { name: cat.name },
        });

        if (!exists) {
            await prisma.category.create({
                data: cat,
            });
        }
    }

    console.log("카테고리 3개 생성 완료!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
