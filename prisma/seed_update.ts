import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function editUser() {
    const userId = 2;
    const user = await prisma.user.update({
        where: {id: userId},
        data: {role: "ADMIN"}
    })
    return user;
}

editUser()
    .catch((e) => {
        console.error("❌ Помилка при заповненні БД:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
