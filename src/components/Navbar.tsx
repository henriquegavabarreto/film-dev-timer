'use client';

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Display navbar on top (in every page)
export default function NavBar()
{
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [logOutError, setLogOutError] = useState<string | null>(null);

    // Check if user is authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/'); // redirects to home if user is null
        } catch (error: unknown) {
            if(error instanceof Error) {
                setLogOutError(error.message);
            }
            setLogOutError("Could not log out at this time.");
        }
    };

    return (
        <nav className="flex flex-row content-end border-b-2 border-zinc-600 dark:text-zinc-50">
            <div className="flex flex-col w-full">
                {logOutError && <div className="text-end mx-3 my-2 text-xs min-w-52 text-red-600">{logOutError}</div>}
                <div className="text-end mx-3 mt-2 text-xs min-w-52">{ user && `Hello, ${user.email?.slice(0, user.email.indexOf('@'))}!` }</div>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row">
                        <div className="my-3 mx-4 content-end hover:scale-110 transition ease-in-out">
                            <Link href="/">Home</Link>
                        </div>
                        <div className="my-3 mx-4 content-end hover:scale-110 transition ease-in-out">
                            <Link href="/about">About</Link>
                        </div>
                        {
                            user &&
                            (<>
                                <div className="my-3 mx-4 content-end hover:scale-110 transition ease-in-out">
                                    <Link href="/workflow/list">Workflow List</Link>
                                </div>
                                <div className="my-3 mx-4 content-end hover:scale-110 transition ease-in-out">
                                    <Link href="/history">History</Link>
                                </div>
                            </>)
                        }
                    </div>
                    <div>
                        { user ? 
                        (
                            <div className="py-3 px-4">
                                    <div className="text-end hover:scale-110 hover:cursor-pointer transition ease-in-out" onClick={handleLogout}>Log out</div>
                            </div>
                        ) :
                        (<div className="my-3 mx-4 content-end hover:scale-110 transition ease-in-out">
                            <Link href="/login">Login</Link>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}