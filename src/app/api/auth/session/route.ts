import { NextResponse } from 'next/server'
import{authOptions} from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from 'next-auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        return NextResponse.json(session)
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function POST() {
    return NextResponse.json({ success: true })
}