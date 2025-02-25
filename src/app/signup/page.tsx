'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setPersistence, browserSessionPersistence, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthError from '@/components/AuthError';
import { getAuthErrorMessage } from '@/lib/getAuthErrorMessage';

export default function SignUp() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // set any error message to null
        setLoading(true);
        try {
            await setPersistence(auth, browserSessionPersistence); // set persistence to user current tab
            await createUserWithEmailAndPassword(auth, email, password); // authenticate with firebase
            router.push('/workflow/list'); // redirect to workflow list after log in
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "code" in error) {
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
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form onSubmit={handleSignUp}>
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
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dark:text-zinc-400 w-full px-3 py-2 border rounded-md"
                    required
                />
            </div>
            <AuthError errorMessage={error}/>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md"
                disabled={loading}
            >
                {loading ? 'Signing up...' : 'Sign Up'}
            </button>
        </form>
        </div>
    );
}