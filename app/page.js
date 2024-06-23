'use client'

/*export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello world</h1>
    </main>
  );
}*/

import { useAuth } from '@/context/AuthContext';

export default function Home() {
    const { logout } = useAuth();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Hello world</h1>
            <button
                onClick={logout}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </main>
    );
}

