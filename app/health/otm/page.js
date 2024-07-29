'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import config from '@/config'; //for apiUrl

/* DataTable */
// Dynamic Import
const DataTableComponent = dynamic(
    () => import('@/components/DatatableOtm'),
    { ssr: false }
);
/************************/

import {parseCookies} from "nookies";

const OtmPage = () => {
    /* Get "hospitals_id" from cookies*/
    const cookies = parseCookies();
    const hospitals_id = cookies.hospitals_id
    //console.log(hospitals_id)

    const router = useRouter();

    const [items, setItems] = useState([]);


    /**
     * Fetch items from the server and set them using setItems function.
     *
     * @function fetchItems
     * @returns {void}
     */

    useEffect(() => {
        fetchItems();
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchItems = () => {
        fetch(`${config.apiUrl}/historials/getByHospital/${hospitals_id}`)
            .then(response => response.json())
            .then(data => {

                /* Filtered by "show" and the current "hospitals_id" */
                /*let filteredData = data.filter(item => item.show === "1");
                setItems(filteredData)*/
                setItems(data)
            })
            .catch(error => console.error('Error fetching items:', error));
    };

    const newotm = () => {
      router.push('/health/newotm')
    }


    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">OTM</h1>
            <button onClick={newotm} className="bg-blue-500 text-white p-2 rounded">New OTM</button>

            {/* DataTable*/}
            <DataTableComponent items={items}/>
        </div>
    );
};

export default OtmPage;
