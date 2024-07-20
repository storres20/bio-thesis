'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* DataTable */
// Dynamic Import
const DataTableComponent = dynamic(
    () => import('../../components/DatatableOtm'),
    { ssr: false }
);
/************************/

import {parseCookies} from "nookies";

const OtmPage = () => {
    /* Backend API URL */
    //const apiUrl = 'http://localhost:3001/api/v1'
    const apiUrl = 'https://bio-thesis-mongoback.vercel.app/api/v1'

    /* DataTable useState*/
    const [dataLoaded, setDataLoaded] = useState(false);

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
        fetch(`${apiUrl}/historials/getByHospital/${hospitals_id}`)
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
      router.push('/newotm')
    }


    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">OTM</h1>
            <button onClick={newotm} className="bg-blue-500 text-white p-2 rounded">New OTM</button>

            {/* DataTable*/}
            <div className="overflow-x-auto">
                <DataTableComponent items={items} />
            </div>
        </div>
    );
};

export default OtmPage;
