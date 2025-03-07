'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getAuthErrorMessage } from '@/lib/getAuthErrorMessage';

export default function Reset() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // set any error message to null
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setLoading(false);
            setError(null);
            setSent(true); // this prevents the form from rendering
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error) { // if the firebase call returns an error
                setError(getAuthErrorMessage((error as { code: string }).code));
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
            {sent ? 
                (<div className="my-2">Email Sent!</div>)
                    :
                (
                    <form onSubmit={handleReset}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="dark:text-zinc-400 w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>
                        {error !== '' && (<p className="my-2 text-red-600">{error}</p>)}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send email'}
                        </button>
                    </form>
                )
            }
        </div>
    );
}