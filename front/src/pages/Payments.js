import Header from "../components/Header";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import Popup from "reactjs-popup";

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
    const [openModal, setOpenModal] = useState(false);
    const closeModal = () => setOpenModal(false);

    const columns = [
        // {
        //     name: "Trx Id",
        //     selector: (row) => row.trxid,
        //     sortable: true,
        // },
        {
            name: "Date",
            selector: (row) => {
                let date = row.trx_time.split("T")[0];
                let time = row.trx_time.split("T")[1];
                return date + " " + time.substring(0, 5);
            },
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
            name: "Coin",
            selector: (row) => row.stars,
            sortable: true,
        },
        {
            name: "Diamond",
            selector: (row) => row.diamonds,
            sortable: true,
        },
        
    ];
    const [payments, setPayments] = useState([]);
    const [filterText, setFilterText] = useState("");
    
    const fetchPayments = async () => {
        const response = await axios.get("/api/payment");
        if (response.status === 200) {
            setPayments(response.data);
        }
    }

    useEffect(() => {
        fetchPayments();
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

                    <button 
                        onClick={() => setOpenModal(!openModal)}
                        className="p-3 bg-[#2d353c] hover:bg-[#446d14] text-[#ffffff] rounded-md" >
                            Add Transaction
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    persistTableHead
                />
            </div>

            <TransactionPopup
                open={openModal}
                setOpen={setOpenModal}
                closeModal={closeModal}
                fetchPayments = {fetchPayments}
            /> 
        </div>
    );
}


function TransactionPopup({ open, setOpen, closeModal, fetchPayments }) {
    const [transaction, setTransaction] = useState({
        user_name: "",
        pac: "Basic",
        amount: 5,
        stars: 100,
        diamonds: 2,
        note: ""
    });
    const [readonly, setReadonly] = useState(true);
    const [error, setError] = useState("");

    const overlayStyle = { background: "rgba(0,0,0,0.5)" };
    
    const handlePackageChange = (e) => {
        const pac = e.target.value;
        switch(pac){
            case "Basic":
                setReadonly(true);
                setTransaction({
                    ...transaction, 
                    pac: pac,
                    amount: 5,
                    stars: 100,
                    diamonds: 2
                });
                break;
            case "Standard":
                setReadonly(true);
                setTransaction({
                    ...transaction, 
                    pac: pac,
                    amount: 25,
                    stars: 550,
                    diamonds: 11
                });
                break;
            case "Premium":
                setReadonly(true);
                setTransaction({
                    ...transaction, 
                    pac: pac,
                    amount: 50,
                    stars: 1200,
                    diamonds: 24
                });
                break;
            case "Custom":
                setReadonly(false);
                setTransaction({
                    ...transaction, 
                    pac: pac,
                    amount: 0,
                    stars: 0,
                    diamonds: 0
                });
                break;
        }
    }


    const submitHandler = async (e) => {
        e.preventDefault();
       
        
        if(transaction.user_name.trim() === ""){
            setError("Please enter the User Name!");
            return;
        }

        console.log(transaction);
        const response = await axios.post("/api/payment/addTransaction", transaction);
        const resData = response.data;

        console.log(response);
        if (resData.status === 401) {
            setError("The entered user does not exist.");
            return;
        } else if(resData.status === 200){
            setOpen(!open);
            fetchPayments();
            // window.location.reload();
        }

        // setOpen(!open);
    };

    useEffect(() => {
        
    }, []);
    
    return (
        <div className="w-full h-full ">
            <Popup
                open={open}
                closeOnDocumentClick
                onClose={closeModal}
                {...{ overlayStyle }}
            >
                <div className="md:w-[400px] w-[300px] bg-white rounded-md overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="text-xl font-semibold text-center">
                            Add Transaction
                        </h3>
                    </div>
                    
                    <div class="relative py-3 pl-4 pr-10 leading-normal text-red-700 bg-red-100 rounded-lgg" role="alert" style={{display: error ? 'block' : 'none' }} >
                        <p>{error}</p>
                    </div>
                    
                    <form onSubmit={submitHandler} className="px-4">
                        <div>
                            <div className="flex flex-col mt-8">
                                <label htmlFor="username">User Name:</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={transaction.user_name}
                                    onChange={(e) => {
                                        setError("");
                                        setTransaction({...transaction, user_name:e.target.value})
                                    }}
                                    className="p-2 outline-none border"
                                />
                            </div>
                            <div className="flex flex-col mt-8">
                                <label htmlFor="package" >Package:</label>
                                <select id="package" 
                                    className="p-2 outline-none border" 
                                    onChange={handlePackageChange} 
                                    value={transaction.pac} 
                                >
                                    <option value="Basic">Basic</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                            <div className="flex flex-col mt-8">
                                <label htmlFor="amount">Amount:</label>
                                <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    value={ transaction.amount } 
                                    onChange={(e) => setTransaction({...transaction, amount: e.target.value})}
                                    className="p-2 outline-none border"
                                    readOnly={readonly}
                                />
                            </div>
                            <div className="flex flex-col mt-8">
                                <label htmlFor="coins">Coins:</label>
                                <input
                                    type="number"
                                    name="coins"
                                    id="coins"
                                    value={transaction.stars}
                                    onChange={(e) => setTransaction({...transaction, stars:e.target.value})}
                                    className="p-2 outline-none border"
                                    readOnly={readonly}
                                />
                            </div>
                            <div className="flex flex-col mt-8">
                                <label htmlFor="diamonds">Diamonds:</label>
                                <input
                                    type="number"
                                    name="diamonds"
                                    id="diamonds"
                                    value={transaction.diamonds}
                                    onChange={(e) => setTransaction({...transaction, diamonds:e.target.value})}
                                    className="p-2 outline-none border"
                                    readOnly={readonly}
                                />
                            </div>
                            <div className="flex flex-col mt-8">
                                <label htmlFor="note">Note:</label>
                                <textarea
                                    name="note"
                                    id="note"
                                    value={transaction.note}
                                    onChange={(e) => setTransaction({...transaction, note:e.target.value})}
                                    className="p-2 outline-none border"
                                />
                            </div>
                        </div>

                        <div className="my-8 flex flex-row items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setOpen(!open)}
                                className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                className="ml-2 px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white"
                                type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>
        </div>
    );
}
