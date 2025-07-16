// app/health/[id]/page.js
'use client'

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

/* DataTable */
const DataTableComponent = dynamic(
    () => import('@/components/health/DatatableInventoryId/DatatableInventoryId'),
    { ssr: false }
);

const HealthDetail = ({ params }) => {
    const { id } = params;
    const router = useRouter();

    const returnBack = () => {
        router.push('/health');
    };

    return (
        <main className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Health by ID</h1>

            <button
                onClick={returnBack}
                className="mb-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                ← Return back
            </button>

            {/* DataTable Component */}
            <DataTableComponent id={id} />
        </main>
    );
};

export default HealthDetail;
