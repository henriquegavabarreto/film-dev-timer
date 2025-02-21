import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Form to gather and save history information
export default function HistoryItemForm( { workflowId, workflowTitle, hasActiveTimer }: { workflowId: string, workflowTitle: string, hasActiveTimer: boolean }) {
    const route = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {},[hasActiveTimer]); // update this component based on parent timer activity

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setSaving(true);

        try {
            setErrorMessage(null);

            if(!auth.currentUser) throw new Error('User is not logged in');

            const idToken = await auth.currentUser.getIdToken();

            const res = await fetch('/api/history/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notes: notes, workflowId: workflowId, workflowTitle: workflowTitle })
            });

            if (!res.ok) {
                setSaving(false);
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to add history item');
            }
    
            setSaving(false);
            route.push('/history');
        } catch (error: unknown) {
            setSaving(false);
            if(error instanceof Error) {
                setErrorMessage(error.message);
            }
            setErrorMessage('Failed to add history item');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <div>
            <button
                disabled={hasActiveTimer}
                className="w-full font-semibold text-blue-600 border-2 border-blue-600 transition ease-in-out hover:bg-blue-600 hover:text-white py-2 px-4 disabled:text-gray-400 disabled:border-gray-400 disabled:hover:bg-white rounded-md"
                onClick={() => setShowForm(true)}>Finish</button>
            <dialog open={showForm}>
                <div className="overflow-y-auto overflow-x-hidden flex fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-600 bg-opacity-80">
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-300">
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-between">
                                    <div className="p-4 font-semibold text-xl">Add to History</div>
                                    <button
                                        className="p-3"
                                        onClick={() => setShowForm(false)}
                                        disabled={saving}>X</button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-col">
                                        {errorMessage && <div className="m-5"><p className="text-red-600">{errorMessage}</p></div>}
                                        <div className="flex flex-col justify-start p-5">
                                            <label className="text-start font-semibold pb-2 text-lg" htmlFor="notes">Notes</label>
                                            <textarea
                                                id="notes"
                                                maxLength={500}
                                                className="resize-none h-full border border-zinc-400 rounded-sm text-zinc-800 dark:text-zinc-800"
                                                value={notes}
                                                onChange={e => setNotes(e.target.value)}/>
                                        </div>
                                        <div>
                                            <button
                                                className="m-5 font-semibold text-blue-600 border-2 border-blue-600 transition ease-in-out hover:bg-blue-600 hover:text-white px-2 py-1 rounded-md"
                                                type="submit"
                                                disabled={saving}>{saving ? 'Saving...' : 'Save to History'}</button>
                                        </div>
                                    </div>                      
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
}