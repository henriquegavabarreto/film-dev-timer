'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setPersistence, browserSessionPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import AuthError from '@/components/AuthError';
import { getAuthErrorMessage } from '@/lib/getAuthErrorMessage';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // set any error message to null
        setLoading(true);
        try {
            await setPersistence(auth, browserSessionPersistence); // set persistence to user current tab
            await signInWithEmailAndPassword(auth, email, password); // authenticate with firebase
            router.push('/workflow/list'); // redirect to workflow list after log in
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
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
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
            <AuthError errorMessage={error} />
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md"
                disabled={loading}
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
        <div className="mt-5">Do not have a login yet? <Link className="hover:text-blue-500" href="/signup">Sign up here</Link>!</div>
        <div className="mt-2">Forgot your password? <Link className="hover:text-blue-500" href="/reset">Click here</Link>.</div>
        </div>
    );
}