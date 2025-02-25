import { getDecodedToken } from "@/lib/authHelpers";
import { adminDb } from "@/lib/firebaseAdmin";
import { validateCommonData } from "@/lib/validationHelpers";
import { WorkflowInfo } from "@/types/WorkflowInfo";
import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const decodedToken = await getDecodedToken(req); // check if token is valid
        if(!decodedToken) return NextResponse.json({ error: 'Request unauthorized. Invalid or missing token' }, { status: 401 });

        const data = await new Response(req.body).json(); // get data from request

        // try catch for validation errors
        try {
            validateCommonData(data as WorkflowInfo);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            return NextResponse.json({ error: 'Could not validate submitted data.' }, { status: 500 });
        }
        

        // get fresh data from the database to check authorization
        const docRef = adminDb.collection('workflow').doc(data.id); // get doc ref with id

        const querySnapshot = await docRef.get(); // get snapshot

        const doc = querySnapshot.data(); // get data

        if(!doc) return NextResponse.json({ error: `Workflow ${data.id} not found.` }, { status: 404 });

        // check if user is allowed to modify
        if(decodedToken.uid !== doc.createdBy) {
            return NextResponse.json({ error: 'Request unauthorized. A user can modify only their workflows.' }, { status: 401 });
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
    }
}