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

        validateCommonData(data as WorkflowInfo);

        // add timestamp and user provided information and add document
        const docRef = await adminDb.collection('workflow').add({
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
            createdAt: Timestamp.now()
        });

        return NextResponse.json({ message: 'Workflow added', id: docRef.id }, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to add workflow' }, { status: 500 });
    }
}