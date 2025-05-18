import prisma from "@lib/prisma";



async function main() {
    const categories = await prisma.category.createMany({
        data: [
            {name: 'Смартфони'},
            {name: 'Ноутбуки'},
            {name: 'Побутова техніка'},

        ],
        skipDuplicates: true
    })
    console.log(`Створено ${categories.count} категорій`)

    const products = await prisma.product.createMany({
        data: [
            {
                name: 'iPhone 15 Pro',
                price: 1099.99,
                description: 'Флагманський смартфон Apple',
                categoryId: 1
            },     {
                name: 'iPhone 15 ',
                price: 990.99,
                description: 'Флагманський смартфон Apple',
                categoryId: 1
            },     {
                name: 'iPhone 13',
                price: 500.99,
                description: 'Флагманський смартфон Apple',
                categoryId: 1
            },
            {
                name: 'MacBook Air M2',
                price: 1299.99,
                description: 'Легкий та потужний ноутбук',
                categoryId: 2
            }
        ],
        skipDuplicates: true
    })
    console.log(`Створено ${products.count} продуктів`)
}

main()
    .catch(e => {
        console.error('Помилка при заповненні БД:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })