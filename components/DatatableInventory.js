import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useEffect } from 'react';

const DataTableComponent = ({ items = [], dataLoaded }) => {
    useEffect(() => {
        if (items.length > 0 && !dataLoaded) {
            $('#example').DataTable();
        }
    }, [items]);

    return (
        // The table structure goes here
        // Example:
        <table id="example" className="display">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Serie</th>
                        <th>Location</th>
                        <th>Codepat</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map(item => (
                        <tr key={item._id}>
                            <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.brand}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.model}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.serie}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{item.codepat}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => viewItem(item._id)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">View
                                </button>
                                <button onClick={() => newOtm(item._id)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">NewOtm
                                </button>
                                <button onClick={() => viewItem(item._id)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">View
                                </button>
                                <button onClick={() => editItem(item)}
                                        className="text-indigo-600 hover:text-indigo-900 m-1">Edit
                                </button>
                                <button onClick={() => deleteItem(item._id)}
                                        className="text-red-600 hover:text-red-900 m-1">Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
    );
};

export default DataTableComponent;