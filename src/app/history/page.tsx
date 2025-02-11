'use client';
import HistoryList from "@/components/HistoryList";
import { auth } from "@/lib/firebase";
import WorkflowHistoryItem from "@/types/WorkflowHistoryItem";
import useSWR from "swr";

export default function HistoryPage () {
    const getUserHistory = async () => {
        try {
            if(!auth.currentUser) throw new Error('User is not logged in');

            const idToken = await auth.currentUser.getIdToken();
            
            const res = await fetch('/api/history/', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                }
            })
        
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to get history');
            }
        
            const data = await res.json();

            return data.history;
        } catch (error: any) {
            throw new Error(error.message || 'Failed to retrieve history items.');
        }
    }
    const { data, error, isLoading } = useSWR<WorkflowHistoryItem[]>(
        '/history/',
        getUserHistory,
        { onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // Never retry on 404.
            if (error.status === 404) return
         
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