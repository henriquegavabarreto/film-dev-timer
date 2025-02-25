import { getDecodedToken } from "@/lib/authHelpers";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const decodedToken = await getDecodedToken(req); // check if token is valid
        if(!decodedToken) return NextResponse.json({ error: 'Request unauthorized. Invalid or missing token' }, { status: 401 });

        const collectionRef = adminDb.collection('workflow');

        const querySnapshot = await collectionRef.where('createdBy', '==', decodedToken.uid).get(); // get user workflows

        const data = querySnapshot.docs.map(doc => { // format workflow data
            const info = doc.data();
            info.id = doc.id;
            info.createdAt = info.createdAt.toDate();
            return info;
        });

        return NextResponse.json(data, { status: 200 }) // return workflows
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to get use workflows' }, { status: 500 });
    }
}