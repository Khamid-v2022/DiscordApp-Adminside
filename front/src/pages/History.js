import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import axios from "axios";

export default function History() {
    return (
        <section className="flex">
            <Sidebar />
            <div className="w-full">
                <div className="container">
                    <Header title="History Management" />
                    <Content />
                </div>
            </div>
        </section>
    );
}

function Content() {
    const columns = [
        {
            name: "Owner",
            selector: (row) => row.owner,
            sortable: true,
        },
        {
            name: "Server",
            selector: (row) => row.serverName,
            sortable: true,
        },
        {
            name: "Joiner",
            selector: (row) => row.joiner,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
        },
    ];
    const [history, setHistory] = useState([]);

    useEffect(() => {
        (async () => {
            const response = await axios.get("/api/history");
            if (response.status === 200) {
                setHistory(response.data);
            }
        })();
    }, []);

    return (
        <div className="w-full min-h-screen py-6 px-4">
            <div className="flex flex-col">
                <DataTable
                    columns={columns}
                    data={history}
                    pagination
                    persistTableHead
                />
            </div>
        </div>
    );
}
