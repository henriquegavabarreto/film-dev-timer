import { getDecodedToken } from "@/lib/authHelpers";
import { adminDb } from "@/lib/firebaseAdmin";
import { validateLength } from "@/lib/validationHelpers";
import WorkflowHistoryItem from "@/types/WorkflowHistoryItem";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

const getHistoryDoc = async (uid: string): Promise<FirebaseFirestore.DocumentData | undefined> => {
    try {
        const docRef = adminDb.collection('history').doc(uid);

        const querySnapshot = await docRef.get();

        const doc = querySnapshot.data();

        return doc;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export async function GET (req: Request) {
    try {
        const decodedToken = await getDecodedToken(req);
        if(!decodedToken) throw new Error('Token could not be decoded.');

        const doc = await getHistoryDoc(decodedToken.uid);

        if(!doc) throw new Error('History not found.');

        doc.history.forEach((item: any) => {
            item.createdAt = item.createdAt.toDate();
        })

        return NextResponse.json({ ...doc }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Could not get History.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const decodedToken = await getDecodedToken(req); // check if token is valid

        const data = await new Response(req.body).json(); // get data from request

        if (!data) throw new Error('History data was not found.');

        validateLength(data.workflowId, 20);
        validateLength(data.workflowTitle, 50);
        validateLength(data.notes, 500);

        // get existing information
        let doc = await getHistoryDoc(decodedToken.uid);

        const docRef = adminDb.collection('history').doc(decodedToken.uid);

        // Add timestamp
        const historyData = {
            workflowId: data.workflowId,
            workflowTitle: data.workflowTitle,
            notes: data.notes,
            createdAt: Timestamp.now()
        }

        if(doc) { // add data to history
            await docRef.set({ history: [historyData, ...doc.history as WorkflowHistoryItem[]] });
        } else { // create a new document
            await docRef.set({ history: [historyData] });
        }

        return NextResponse.json({message: 'History added', ...data}, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to add history item', message: error.message }, { status: 500 });
    }
}