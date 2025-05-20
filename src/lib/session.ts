import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const getUserSession = async () => {
    const session = await getServerSession(authOptions);
    return session?.user || null;
};
export const mockSession = {
    user: {
        role: "ADMIN",
    },
    expires: "22/03/2029",
};