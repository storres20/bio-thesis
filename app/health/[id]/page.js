// app/health/[id]/page.js
'use client'

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

/* DataTable */
// Dynamic Import
const DataTableComponent = dynamic(
    () => import('@/components/DatatableInventoryId/DatatableInventoryId'),
    { ssr: false }
);
/************************/

const HealthDetail = ({ params }) => {

    const { id } = params;

    /* Router */
    const router = useRouter();

    const returnBack = () => {
        router.push('/health');
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">Health by ID</h1>
            <button onClick={returnBack} className="bg-red-500 text-white p-2 rounded">Return back</button>
            {/* DataTable*/}
            <DataTableComponent id={id}/>
        </div>
    );
};
export default HealthDetail;