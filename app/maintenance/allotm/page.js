'use client'

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import config from '@/config'; //for apiUrl
import { parseCookies } from "nookies";

/* DataTable */
// Dynamic Import
const DataTableComponent = dynamic(
    () => import('@/components/maintenance/DatatableOtm'),
    { ssr: false }
);
/************************/

const AllOtm = () => {

    /* Initialization */
    const cookies = parseCookies();
    const hospitals_id = cookies.hospitals_id;
    const hospitals_name = cookies.hospitals_name;
    const users_id = cookies.users_id;
    const users_email = cookies.users_email;

    /* useState */
    const [items, setItems] = useState([]);
    const [hydrated, setHydrated] = useState(false); // fix hydrated

    /* useEffect */
    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        fetchItems();
    }, []);

    // Function to fetch items
    const fetchItems = () => {
        fetch(`${config.apiUrl}/historials/getByHospital/${hospitals_id}`)
            .then(response => response.json())
            .then(data => {
                setItems(data);
                //console.log(data);
            })
            .catch(error => console.error('Error fetching items:', error));
    };

    /* Conditional Render */
    if (!hydrated) {
        return null; // or a loading indicator
    }

    return (
        <div className="p-8">
            <h1>All OTM from Whole Hospital</h1>

            <p>Hospital name: {hospitals_name}</p>
            <p>Technician id: {users_id}</p>
            <p>Technician: {users_email}</p>

            {/* DataTable*/}
            <DataTableComponent items={items} fetchItems={fetchItems} />
        </div>
    )
}

export default AllOtm;
