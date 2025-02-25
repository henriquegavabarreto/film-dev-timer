import { adminDb } from "@/lib/firebaseAdmin";
import isoData from "@/data/isos_array.json"
import filmData from "@/data/films_array.json";
import developerData from "@/data/developers_array.json";
import { ResourcesData } from "@/types/ResourcesData";
import { NextResponse } from 'next/server';

export async function POST() {
    try { // check if resources has data already, if not populate collection
        const resourcesRef = adminDb.collection('resources');
        const resourcesQuery = resourcesRef.count();
        const resourcesSnapshot = await resourcesQuery.get();
        const resourcesData = resourcesSnapshot.data();

        if (resourcesData.count <= 0) { // Populate as the collection doesn't exist.
            const resources: ResourcesData = {
                isos: isoData.isos,
                films: filmData.films,
                developers: developerData.developers
            };

            await resourcesRef.doc('data').set(resources); // populate resources collection

            return NextResponse.json({ message: 'Collection populated successfully' }, { status: 201 });
        } else { // maintain collection as is
            return NextResponse.json({ status: 204});
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}