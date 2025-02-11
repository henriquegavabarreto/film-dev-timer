import { getDecodedToken } from "@/lib/authHelpers";
import { adminDb } from "@/lib/firebaseAdmin";
import { validateCommonData } from "@/lib/validationHelpers";
import { WorkflowInfo } from "@/types/WorkflowInfo";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const decodedToken = await getDecodedToken(req); // check if token is valid

        const data = await new Response(req.body).json(); // get data from request

        validateCommonData(data);

        // get fresh data from the database
        const currentWorkflow = await getFreshWorkflow(data.id) as WorkflowInfo;

        // check if user is allowed to modify
        if(decodedToken.uid !== currentWorkflow.createdBy) {
            throw new Error('Workflow can be modified only by its owner.');
        }

        // Change provided data, but keep createdAt
        await adminDb.collection('workflow').doc(data.id).set({
            id: data.id,
            film: data.film,
            filmFormat: data.filmFormat,
            iso: data.iso,
            developer: data.developer,
            dilution: data.dilution,
            temperature: data.temperature,
            title: data.title,
            description: data.description,
            steps: data.steps,
            createdBy: decodedToken.uid,
            createdAt: Timestamp.fromDate(new Date(data.createdAt))
        });

        return NextResponse.json({ message: 'Workflow updated', ...data }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update workflow', message: error.message }, { status: 500 });
    }
}

async function getFreshWorkflow(id: string): Promise<FirebaseFirestore.DocumentData> {
    const docRef = adminDb.collection('workflow').doc(id); // get doc ref with id

        const querySnapshot = await docRef.get(); // get snapshot

        const doc = querySnapshot.data(); // get data

        if(!doc) throw new Error(`Workflow ${id} was not found.`);

        return doc;
}