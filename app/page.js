'use client'

import React from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

export default function Home() {

    const cookies = parseCookies();
    console.log('app/pages')
    const users_id = cookies.users_id
    const hospitals_id = cookies.hospitals_id
    const hospitals_name = cookies.hospitals_name
    const profile = cookies.profile

    return (
        <main>
            {/*<h1>User email: {user.email}</h1>
            <p>User password: {user.password}</p>
            <p>User hospital: {user.hospitals_id}</p>
            <p>User id: {user._id}</p>*/}
            <h1>hello world</h1>
            <p>user id : {users_id}</p>
            <p>hospital id : {hospitals_id}</p>
            <p>hospital name : {hospitals_name}</p>
            <p>profile : {profile}</p>

        </main>
    );
}