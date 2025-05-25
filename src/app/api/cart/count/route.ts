import { getServerSession } from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/options";
import prisma from "@lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
        return res.status(401).json({ count: 0 });
    }

    const count = await prisma.cartItem.count({
        where: {
            user: {
                email: session.user.email
            }
        }
    });

    return res.status(200).json({ count });
}
