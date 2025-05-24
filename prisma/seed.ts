import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // const categories = await prisma.category.createMany({
    //     data: [
    //         {name: "Смартфони"},
    //         {name: "Ноутбуки"},
    //         {name: "Побутова техніка"},
    //     ],
    //     skipDuplicates: true,
    // });
    // console.log(`Створено ${categories.count} категорій`);

    const products = await prisma.product.createMany({
        data: [

            {
                name: "ASUS ROG Strix G16",
                price: 1699.99,
                description: "Ігровий ноутбук з високою продуктивністю",
                categoryId: 24,
            },

            {
                name: "Пилосос Dyson V15",
                price: 699.99,
                description: "Бездротовий пилосос з високою потужністю всмоктування",
                categoryId: 25,
            },
            {
                name: "Кондиціонер LG DualCool",
                price: 849.99,
                description: "Енергоефективний кондиціонер з Wi-Fi управлінням",
                categoryId: 25,
            },

            {
                name: "Мікрохвильова піч Samsung",
                price: 199.99,
                description: "Мікрохвильова піч з грилем і сенсорною панеллю",
                categoryId: 26,
            },
            {
                name: "Холодильник Bosch",
                price: 1099.99,
                description: "Двокамерний холодильник з системою NoFrost",
                categoryId: 26,
            },

            {
                name: "Камера Sony Alpha 7 IV",
                price: 2499.99,
                description: "Бездзеркальна камера з повнокадровим сенсором",
                categoryId: 27,
            },
            {
                name: "Навушники Bose QC45",
                price: 329.99,
                description: "Навушники з активним шумопоглинанням",
                categoryId: 27,
            },

            {
                name: "Apple Watch Series 9",
                price: 499.99,
                description: "Смартгодинник з сенсором кисню в крові",
                categoryId: 28,
            },
            {
                name: "Garmin Forerunner 255",
                price: 349.99,
                description: "Фітнес-годинник з GPS та пульсометром",
                categoryId: 28,
            },

            {
                name: "Samsung Neo QLED 65\"",
                price: 1799.99,
                description: "4K телевізор з неймовірною якістю зображення",
                categoryId: 29,
            },
            {
                name: "LG OLED C3 55\"",
                price: 1599.99,
                description: "OLED телевізор з AI-обробкою зображення",
                categoryId: 29,
            },
        ],
        skipDuplicates: true,
    });
    console.log(`Створено ${products.count} продуктів`);

    // await createOrder();

}



// async function createOrder() {
//     const userId = 2;
//
//     const orderItemsData = [
//         {
//             productId: 1,
//             quantity: 2,
//             price: 1099.99,
//         },
//         {
//             productId: 3,
//             quantity: 1,
//             price: 500.99,
//         },
//     ];
//
//     const total = orderItemsData.reduce(
//         (acc, item) => acc + item.price * item.quantity,
//         0
//     );
//
//     const newOrder = await prisma.order.create({
//         data: {
//             userId,
//             total,
//             status: "PENDING",
//             orderItems: {
//                 create: orderItemsData.map((item) => ({
//                     productId: item.productId,
//                     quantity: item.quantity,
//                     price: item.price,
//                 })),
//             },
//         },
//         include: {
//             orderItems: true,
//         },
//     });
//
//     console.log("✅ Замовлення створено:", newOrder);



// }

main()
    .catch((e) => {
        console.error("❌ Помилка при заповненні БД:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
