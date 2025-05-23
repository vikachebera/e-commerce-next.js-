import Categories from "@/components/Categories/Categories";
import Carousel from "@/components/Carousel/Carousel";
import ProductsByCategories from "@/components/ProductsList/ProductsByCategories";

export default async function Home() {

    return (
        <>
            <main className="grid grid-cols-12 bg-gray-50">
                <Categories/>
                <div className="flex flex-col items-center p-8 col-span-10 border-solid border-l-1 border-l-gray-500">
                    <Carousel/>
                    <ProductsByCategories/>
                </div>
            </main>
        </>
    );

}
