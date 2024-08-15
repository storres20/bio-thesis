'use client'

import {useEffect, useState} from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

export default function Home() {

    const cookies = parseCookies();
    const users_id = cookies.users_id
    const hospitals_id = cookies.hospitals_id
    const hospitals_name = cookies.hospitals_name
    const profile = cookies.profile

    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return (
        isHydrated && (
            <main className="p-8">

                <h1>Welcome!!</h1>
                <p>user id : {users_id}</p>
                <p>hospital id : {hospitals_id}</p>
                <p>hospital name : {hospitals_name}</p>
                <p>profile : {profile}</p>

            </main>
        )
    );
}