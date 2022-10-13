import Header from "../components/Header";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function Payments() {
    return (
        <section className="flex">
            <Sidebar />
            <div className="w-full">
                <Header title="Payments Management" />
                <Content />
            </div>
        </section>
    );
}

function Content() {
    const columns = [
        {
            name: "Trx Id",
            selector: (row) => row.trxid,
            sortable: true,
        },
        {
            name: "Username",
            selector: (row) => row.username, //key for data
            sortable: true,
        },
        {
            name: "Amount",
            selector: (row) => {
                return "$" + row.amount + ".00";
            },
            sortable: true,
        },
        {
            name: "Package",
            selector: (row) => row.package,
            sortable: true,
        },
        {
            name: "Date",
            selector: (row) => {
                return new Date(row.trx_time).toDateString();
            },
            sortable: true,
        },
    ];
    const [payments, setPayments] = useState([]);
    const [filterText, setFilterText] = useState("");

    useEffect(() => {
        (async () => {
            const response = await axios.get("/api/payment");
            if (response.status === 200) {
                setPayments(response.data);
            }
        })();
    }, []);

    const filteredItems = payments.filter(
        (item) =>
            item.username &&
            item.username.toLowerCase().includes(filterText.toLowerCase())
    );
    return (
        <div className="w-full min-h-screen py-6 px-4">
            <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    {/* <Link
                        to="/addpayment"
                        className="border rounded-md border-[#76C31C] py-2 px-4 text-white bg-[#76C31C] hover:bg-[#588b1d]"
                    >
                        Add Payments
                    </Link> */}

                    <div className="mt-2 flex flex-row items-center border rounded-md border-[#2d353c] bg-[#2d353c] overflow-hidden">
                        <label htmlFor="search" className="px-4 text-[#ffffff]">
                            <i className="fa fa-search"></i>
                        </label>
                        <input
                            id="search"
                            type="text"
                            value={filterText}
                            placeholder="Search By Username"
                            onChange={(e) => {
                                setFilterText(e.target.value);
                            }}
                            className="outline-none py-2 pl-4"
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    persistTableHead
                />
            </div>
        </div>
    );
}
