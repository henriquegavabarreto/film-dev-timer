'use client';
import HistoryList from "@/components/HistoryList";
import { APIError } from "@/lib/APIError";
import { auth } from "@/lib/firebase";
import WorkflowHistoryItem from "@/types/WorkflowHistoryItem";
import useSWR from "swr";

export default function HistoryPage () {
    const getUserHistory = async () => { // fetcher function for useSWR
        try {
            if(!auth.currentUser) throw new APIError('User is not logged in', 401); // check if user is logged in

            const idToken = await auth.currentUser.getIdToken(); // get token
            
            const res = await fetch('/api/history/', { // make API call to /api/history/
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            })
        
            if (!res.ok) { // throw APIError if response not ok
                const errorData = await res.json();
                throw new APIError(errorData.error || 'Failed to get history', errorData.status); // throw APIError so we can use status
            }
        
            const data = await res.json();

            return data.history; // return user history
        } catch (error: unknown) {
            if (error instanceof APIError) { // propagate APIError
                throw error;
            } else if (error instanceof Error) { // throw new error with message
                throw new Error(error.message);
            }
            throw new Error('Failed to retrieve history items.');
        }
    }

    const { data, error, isLoading } = useSWR<WorkflowHistoryItem[]>( // handle fetch with useSWR
        '/history/',
        getUserHistory,
        { onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404 or 401.
            if (error.status === 404 || error.status === 401) return
         
            // Only retry up to 5 times.
            if (retryCount >= 5) return
         
            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000)
          }
        });
 
    if (error) return <div>{error.message}</div>
    if (isLoading) return <div className="flex align-center justify-center">loading...</div>

    return (
        <div className="flex flex-col">
            <h3 className="m-5 text-center text-2xl">Workflow Usage History</h3>
            {!data || data.length <= 0 ? <div className="m-5 text-lg">No history to display</div> : <HistoryList data={data} />}
        </div>
    );
}