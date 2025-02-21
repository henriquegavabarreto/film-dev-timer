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
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("An unknown error occurred");
    }
}

export async function GET (req: Request) {
    try {
        const decodedToken = await getDecodedToken(req);
        if(!decodedToken) throw new Error('Token could not be decoded.');

        const doc = await getHistoryDoc(decodedToken.uid);

        if(!doc) throw new Error('History not found.');

        const history: WorkflowHistoryItem[] = [];

        doc.history.forEach((item: { createdAt: Timestamp, workflowId: string, workflowTitle: string, notes: string }) => {
            history.push({ 
                createdAt: item.createdAt.toDate(),
                workflowId: item.workflowId,
                workflowTitle: item.workflowTitle,
                notes: item.notes });
        })

        return NextResponse.json({ history }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
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
        const doc = await getHistoryDoc(decodedToken.uid);

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
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to add history item' }, { status: 500 });
    }
}