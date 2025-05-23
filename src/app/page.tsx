import Categories from "@/components/Categories/Categories";
import Carousel from "@/components/Carousel/Carousel";
import ProductsByCategories from "@/components/ProductsList/ProductsByCategories";

export default async function Home() {
    return (
        <main className="min-h-screen  ">
            <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto px-10 sm:px-6 lg:px-10 py-10">
                <div className="hidden md:block col-span-3">
                    <Categories />
                </div>

                <div className="col-span-12 md:col-span-9 space-y-8" >
                    <section className="bg-transparent rounded-xl  overflow-hidden ">
                        <Carousel />
                    </section>
                </div>

                    <section className=" col-span-12  p-6 ">
                        <ProductsByCategories />
                    </section>
            </div>
        </main>
    );
}