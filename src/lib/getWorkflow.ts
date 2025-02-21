import { WorkflowInfo } from "@/types/WorkflowInfo";
import { Auth } from "firebase/auth";

// get workflow with id
export default async function getWorkflow(id: string, auth: Auth): Promise<WorkflowInfo> {
    if(!id) throw new Error('Could not find workflow id.');
    if(!auth.currentUser) throw new Error('User is not logged in.');

    try {
        const idToken = await auth.currentUser.getIdToken();

        const res = await fetch(`/api/workflow/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to retrieve workflow');
        }

        const retrievedWorkflow = await res.json();

        return retrievedWorkflow;
    } catch (error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('Failed to retrieve workflow');
    }
}