import CategoryProducts from "@/components/Category/CategoryProducts";
import prisma from "@lib/prisma";




export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
   const resoledParams = await params;
    const id =  resoledParams.id;
    const categoryId = Number(id);
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) return <div>Категорію не знайдено</div>;

    return (
        <div className="p-6 m-6">

            <CategoryProducts category={category}/>
        </div>
    )
}