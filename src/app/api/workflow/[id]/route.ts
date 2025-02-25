import { getDecodedToken } from "@/lib/authHelpers";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET (req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if(!id) return NextResponse.json({ message: 'Missing required field: id'}, { status: 400 });

        const decodedToken = await getDecodedToken(req); // get decoded token
        if(!decodedToken) return NextResponse.json({ error: 'Request unauthorized. Invalid or missing token' }, { status: 401 });

        const docRef = adminDb.collection('workflow').doc(id); // get doc reference with id

        const querySnapshot = await docRef.get(); // get snapshot

        const doc = querySnapshot.data(); // get data

        if(!doc) return NextResponse.json({ error: `Workflow ${id} does not exist.` }, { status: 404 });

        doc.id = docRef.id;
        doc.createdAt = doc.createdAt.toDate(); // parse createdAt Timestamp

        return NextResponse.json({ ...doc }, { status: 200 }); // return workflow information
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to get user workflow'  }, { status: 500 });
    }
}

export async function DELETE (req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if(!id) return NextResponse.json({ message: 'Missing required field: id'}, { status: 400 });

        const decodedToken = await getDecodedToken(req); // get decoded token
        if(!decodedToken) return NextResponse.json({ error: 'Request unauthorized. Invalid or missing token' }, { status: 401 });

        const docRef = adminDb.collection('workflow').doc(id); // get doc ref with id

        const querySnapshot = await docRef.get(); // get snapshot

        const doc = querySnapshot.data(); // get data

        if(!doc) return NextResponse.json({ error: `Workflow ${id} does not exist.` }, { status: 404 });
    
        if(doc.createdBy !== decodedToken.uid) return NextResponse.json({ error: 'Request unauthorized. A user can delete only their workflows.' }, { status: 401 });

        await docRef.delete(); // delete workflow

        await updateHistory(decodedToken.uid, id); // remove workflow references from history items

        return NextResponse.json({ status: 204 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
    }    
}

// update history items removing workflowId reference
// WorkflowId is used only for easy access to the workflow
const updateHistory = async (uid: string, id: string) => {
    try {
        const docRef = adminDb.collection('history').doc(uid);

        const querySnapshot = await docRef.get();

        const doc = querySnapshot.data();

        if(!doc) return; // User has no history - nothing to update

        // remove workflow references
        for(let i = 0; i < doc.history.length; i++){
            if(doc.history[i].workflowId == id) {
                doc.history[i].workflowId = '';
            }
        }

        await docRef.set({ history: [...doc.history] }); // set history
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Failed to update history.');
    }
}
