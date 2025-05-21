import prisma from "@lib/prisma";
import {NextResponse, NextRequest} from "next/server";

const handlers =
    {
        GET: async (req: NextRequest, {params}: { params: Promise<{ id: string }> }) => {
            const resolvedParams = await params;

            try {
                const categories = prisma.category.findUnique({
                    where: {id: Number(resolvedParams.id)},
                })

                if (!categories) {
                    return NextResponse.json({error: "Category not found"}, {status: 404});

                }

                return NextResponse.json(categories, {status: 200});
            } catch (error) {
                console.log(error);
                return NextResponse.json({error: "Internal Server Error"}, {status: 500});

            }

        },

        PUT:
            async (req: NextRequest, {params}: { params: Promise<{ id: string }> }) => {
                const resolvedParams = await params;
                try {
                    const {name} = await req.json();
                    const category = await prisma.category.update({
                        where: {id: Number(resolvedParams.id)},
                        data: {
                            name
                        }
                    })
                    return NextResponse.json(category, {status: 200})
                } catch (err) {
                    console.log(err);
                    return NextResponse.json({error: "Internal Server Error"}, {status: 500});

                }
            },
        DELETE: async (req: NextRequest, {params}: { params: Promise<{ id: string }> }) => {
            const resolvedParams = await params;
            try {
                await prisma.product.deleteMany({
                    where: {categoryId: Number(resolvedParams.id)},
                });
                await prisma.category.delete({
                    where: {id: Number(resolvedParams.id)},
                });

                return NextResponse.json({success: true});

            } catch (error) {
                console.log(error);
                return NextResponse.json({error: "Internal Server Error"}, {status: 500});

            }

        }

    }

export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;