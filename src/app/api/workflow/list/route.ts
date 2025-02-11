import { getDecodedToken } from "@/lib/authHelpers";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const decodedToken = await getDecodedToken(req); // check if token is valid

        const collectionRef = adminDb.collection('workflow');

        const querySnapshot = await collectionRef.where('createdBy', '==', decodedToken.uid).get();

        const data = querySnapshot.docs.map(doc => {
            const info = doc.data();
            info.id = doc.id;
            info.createdAt = info.createdAt.toDate();
            return info;
        });

        return NextResponse.json(data, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to get user workflows', message: error.message }, { status: 500 });
    }
}