import { getDecodedToken } from "@/lib/authHelpers";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET (req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if(!id) throw new Error('Id must be provided to retrieve a workflow.');

        const token = await getDecodedToken(req); // get decoded token
        if(!token) throw new Error('Token could not be decoded.');

        const docRef = adminDb.collection('workflow').doc(id); // get doc ref with id

        const querySnapshot = await docRef.get(); // get snapshot

        const doc = querySnapshot.data(); // get data

        if(!doc) throw new Error(`Workflow ${id} was not found.`);

        doc.id = docRef.id;
        doc.createdAt = doc.createdAt.toDate();

        return NextResponse.json({ ...doc }, { status: 201 });
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
        if(!id) throw new Error('Id must be provided to retrieve a workflow.');

        const token = await getDecodedToken(req); // get decoded token
        if(!token) throw new Error('Token could not be decoded.');

        const docRef = adminDb.collection('workflow').doc(id); // get doc ref with id

        const querySnapshot = await docRef.get(); // get snapshot

        const doc = querySnapshot.data(); // get data

        if(!doc) throw new Error('Workflow not found.');
    
        if(doc.createdBy !== token.uid) throw new Error('A user can only delete their workflows');

        await docRef.delete();

        await updateHistory(token.uid, id);

        return NextResponse.json({ message: 'Workflow deleted successfully' }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to delete workflow'  }, { status: 500 });
    }    
}

const updateHistory = async (uid: string, id: string) => {
    try {
        const docRef = adminDb.collection('history').doc(uid);

        const querySnapshot = await docRef.get();

        const doc = querySnapshot.data();

        if(!doc) throw new Error('Could not find history');

        for(let i = 0; i < doc.history.length; i++){
            if(doc.history[i].workflowId == id) {
                doc.history[i].workflowId = '';
            }
        }

        await docRef.set({ history: [...doc.history] });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Failed to update history.');
    }
}
