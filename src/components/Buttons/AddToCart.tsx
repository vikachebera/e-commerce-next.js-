'use client';

type AddToCartProps = {
    productId: number;
};

export default function AddToCart({ productId }: AddToCartProps) {

    const handleAddToCart = async () => {

        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: Number(productId),
                    quantity: 1,
                }),
            });

            if (!res.ok) throw new Error("Помилка при додаванні до кошика");

            alert("Товар додано до кошика");
        } catch (err) {
            console.error(err);
            alert("`Помилка при додаванні до кошика`" );
        }
    };

    return (
        <button
            className="bg-black text-white border-2 rounded-md p-2 m-2 flex"
            onClick={handleAddToCart}
        >
            Додати до кошика
        </button>
    );
}