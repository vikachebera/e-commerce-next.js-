import { useState } from "react";

export default function PasswordField({ password }: { password: string }) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <h3 className="text-sm font-medium text-gray-500">Пароль</h3>
            <p className="mt-1 text-lg break-all">
                {show ? password : "*".repeat(8)}
            </p>
            <button
                onClick={() => setShow(!show)}
                className="mt-2 text-sm text-blue-600 hover:underline"
            >
                {show ? "Сховати" : "Показати"}
            </button>
        </div>
    );
}
