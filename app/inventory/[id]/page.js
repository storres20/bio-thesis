// app/inventories/[id]/page.js
'use client'

import dynamic from 'next/dynamic';

/* DataTable */
// Dynamic Import
const DataTableComponent = dynamic(
    () => import('../../../components/DatatableInventoryId'),
    { ssr: false }
);
/************************/

const InventoryDetail = ({ params }) => {

    const { id } = params;

    return (
        <div className="p-8">
            {/* DataTable*/}
            <DataTableComponent id={id} />
        </div>
    );
};
export default InventoryDetail;