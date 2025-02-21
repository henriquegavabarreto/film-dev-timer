'use client';
import WorkflowList from "@/components/WorkflowList";
import { auth } from "@/lib/firebase";
import { WorkflowInfo } from "@/types/WorkflowInfo";
import Link from "next/link";
import useSWR from "swr";

export default function WorkflowListPage() {
    const getUserWorkflows = async () => {
        try {
            if(!auth.currentUser) throw new Error('User is not logged in');

            const idToken = await auth.currentUser.getIdToken();
            
            const res = await fetch('/api/workflow/list', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            })
        
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to get workflow list.');
            }
        
            const workflowData = await res.json();

            return workflowData;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An expected error occurred while fetching the workflow list.');
        }
    }

    const { data, error, isLoading } = useSWR<WorkflowInfo[]>(
        '/workflow/list',
        getUserWorkflows,
        { onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return
         
            // Only retry up to 5 times.
            if (retryCount >= 5) return
         
            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
          }
        }
    );
 
    if (error) return <div className="flex align-center justify-center mt-5">{error.message} Try again in a few moments.</div>
    if (isLoading) return <div className="flex align-center justify-center mt-5">loading...</div>

    return (
        <div className="flex flex-col">
            <h3 className="m-5 text-center text-2xl">Workflow list</h3>
            <div className="m-5 text-end">
                <Link href="/workflow/new">
                    <button 
                        className="font-semibold text-blue-600 border-2 border-blue-600 transition ease-in-out hover:bg-blue-600 hover:text-white py-2 px-4 rounded-md">
                            Create New Workflow
                    </button>
                </Link>
            </div>
            {!data || data.length <= 0 ? <div className="m-5 text-lg">No workflows to display</div> : <WorkflowList data={data} />}
        </div>
    );
}