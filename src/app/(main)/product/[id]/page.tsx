import DescriptionPage from "@/components/ProductsList/DescriptionPage";
import prisma from "@lib/prisma";

export default async function ProductPage({params}: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const product = await prisma.product.findUnique({
        where: {id: Number(resolvedParams.id)}
    })
    if (!product) return <div>Товар не знайдено</div>;

    return (
        <DescriptionPage product={product}/>
    )
}