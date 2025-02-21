import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Display delete workflow button
export default function DeleteWorkflowButton(props: { id: string | undefined, hasActiveTimer: boolean }) {
    const [deleting, setDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {}, [props.hasActiveTimer]);

    const handleDelete = async (id: string | undefined) => {
        try {
            if(window.confirm('Are you sure you want to delete this workflow?')) { // confirm deletion
                setErrorMessage(null);
                setDeleting(true);

                if(!id) throw new Error('Could not find workflow id');
                if(!auth.currentUser) throw new Error('User is not logged in');
    
                const idToken = await auth.currentUser.getIdToken();
                
                const res = await fetch(`/api/workflow/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                        'Content-Type': 'application/json'
                    }
                })
    
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to delete workflow');
                }
    
                setDeleting(false);
                router.push('/workflow/list');
            }
        } catch (error: unknown) {
            setDeleting(false);
            if(error instanceof Error) {
                setErrorMessage(error.message);
            }
            setErrorMessage('Failed to delete workflow');
        }
        
    }

    return (
        <>
            { errorMessage && <p className="text-red-600 m-4">{errorMessage}</p> }
            <button
                className="m-4 p-4 font-semibold text-red-600 border-2 border-red-600 transition ease-in-out hover:bg-red-600 disabled:text-gray-400 disabled:border-gray-400 disabled:hover:bg-white hover:text-white rounded-md" 
                onClick={() => handleDelete(props.id)}
                disabled={deleting || props.hasActiveTimer}
                >{deleting ? 'Deleting...' : 'Delete Workflow'}
            </button>
        </>
    );
}