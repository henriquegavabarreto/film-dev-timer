// This file has functions meant to be used in server components
// as it does not make sense to use fetch from the server.
// Functions are wraped in the cache function to memoize its return value
import { cache } from "react";
import { adminDb } from "./firebaseAdmin";
import { ResourcesData } from "@/types/ResourcesData";

const getResources = cache(async (): Promise<ResourcesData> => {
    const docRef = adminDb.collection('resources').doc('data');

    const querySnapshot = await docRef.get();

    if (!querySnapshot.exists) {
        throw new Error('Resources do no exist.');
    }

    const data = querySnapshot.data();

    return data as ResourcesData;
});

export { getResources };