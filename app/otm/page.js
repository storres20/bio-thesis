'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/* DataTable */
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';
/************************/

const OtmPage = () => {

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-6">OTM</h1>
        </div>
    );
};

export default OtmPage;
