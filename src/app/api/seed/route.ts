import { adminDb } from "@/lib/firebaseAdmin";
import isoData from "@/data/isos_array.json"
import filmData from "@/data/films_array.json";
import developerData from "@/data/developers_array.json";
import { ResourcesData } from "@/types/ResourcesData";
import { NextResponse } from 'next/server';

export async function POST() {
    try {
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

            await resourcesRef.doc('data').set(resources);

            return NextResponse.json({ message: 'Collection populated successfully' });
        } else {
            return NextResponse.json({ message: 'resources collection already exists' });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Failed to seed database' });
    }
}