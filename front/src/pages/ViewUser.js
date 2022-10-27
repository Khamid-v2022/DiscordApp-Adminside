import axios from "axios";
import { useLayoutEffect, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import Popup from "reactjs-popup";

export default function Users() {
  return (
    <section className="flex">
      <Sidebar />
      <div className="w-full">
        <Header title="Users Management" />
        <ViewUser />
      </div>
    </section>
  );
}

function ViewUser() {
    const [openDiamond, setOpenDiamond] = useState(false);
    const closeModalDiamond = () => setOpenDiamond(false);

    const [openStar, setOpenStar] = useState(false);
    const closeModalStar = () => setOpenStar(false);

    const [user, setUser] = useState({
        _id: "",
        username: "",
        email: "",
        stars: "",
        diamonds: "",
        spent: 0,
        status: "",
        created_at: 0,
    });

    const params = useParams();
    const { id } = params;

    const fetchdata = async () => {
        const response = await axios.get(`/api/member/getmember/${id}`);
        console.log(response);
        if (response.status === 200) {
            setUser(response.data);
        }
    };

    useEffect(() => {
        (async () => {
            fetchdata();
        })();
    }, []);

    return (
        <div className="px-4">
            <div className="flex flex-col mt-4">
                <div className="flex">
                    <div className="my-2 w-1/2 flex flex-col mr-2">
                        <b>Username: </b>
                        <span className="bg-gray-200 p-2 rounded-md h-10">{user.username}</span>
                    </div>
                    <div className="my-2 w-1/2 flex flex-col">
                        <b>Email: </b>
                        <span className="bg-gray-200 p-2 rounded-md h-10">{user.email}</span>
                    </div>
                </div>

                <div className="flex">
                    <div className="my-2 w-1/3 flex flex-col">
                        <b>Diamonds: </b>
                        <div className="bg-gray-200 px-2 py-1 rounded-md flex flex-row items-center justify-between h-10">
                            <span>{user.diamonds}</span>
                            <button
                                onClick={() => setOpenDiamond(!openDiamond)}
                                className="px-3 py-1 bg-[#2d353c] hover:bg-[#446d14] text-[#ffffff] rounded-md">
                                Edit
                            </button>
                        </div>
                        <Diamonds
                            data={user}
                            open={openDiamond}
                            setOpen={setOpenDiamond}
                            closeModal={closeModalDiamond}
                            fetchdata={fetchdata}
                        />
                    </div>

                    <div className="my-2 w-1/3 flex flex-col ml-2">
                        <b>Stars: </b>
                        <div className="bg-gray-200 px-2 py-1 rounded-md flex flex-row items-center justify-between h-10">
                            <span>{user.stars}</span>
                            <button
                                onClick={() => setOpenStar(!openStar)}
                                className="px-3 py-1 bg-[#2d353c] hover:bg-[#446d14] text-[#ffffff] rounded-md">
                                Edit
                            </button>
                        </div>
                        <Stars
                            data={user}
                            open={openStar}
                            setOpen={setOpenStar}
                            closeModal={closeModalStar}
                            fetchdata={fetchdata}
                        />
                    </div>
                    <div className="my-2 w-1/3 flex flex-col ml-2">
                        <b>Spent: </b>
                        <span className="bg-gray-200 p-2 rounded-md h-10">USD ${user.spent}</span>
                    </div>
                </div>

                <div className="flex">
                    <div className="my-2 w-1/2 flex flex-col">
                        <b>Status: </b>
                        <span className="bg-gray-200 p-2 rounded-md h-10">{user.status}</span>
                    </div>
                    <div className="my-2 w-1/2 flex flex-col ml-2">
                        <b>Registered at:</b>
                        <span className="bg-gray-200 p-2 rounded-md h-10">
                            {new Date(user.created_at).toDateString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Diamonds({ data, open, closeModal, setOpen, fetchdata }) {
    const [amount, setAmount] = useState(data.diamonds);
    const overlayStyle = { background: "rgba(0,0,0,0.5)" };
    const submitHandler = async (e) => {
        e.preventDefault();
        const dat = {
            id: data._id,
            amount: amount,
        };

        const response = await axios.post("/api/member/updatediamonds", dat);
        if (response.status === 200) {
            fetchdata();
        }
        setOpen(!open);
    };

    useEffect(() => {
        setAmount(data.diamonds);
    }, [data]);
    
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
                        Update User Diamonds
                        </h3>
                    </div>

                    <form onSubmit={submitHandler} className="px-4">
                        <div className="flex flex-col mt-8">
                            <label htmlFor="amount">Amount:</label>
                            <input
                                type="text"
                                name="amount"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="p-2 outline-none border"
                            />
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

function Stars({ data, open, closeModal, setOpen, fetchdata }) {
    const [amount, setAmount] = useState(data.stars);
    const overlayStyle = { background: "rgba(0,0,0,0.5)" };
    const submitHandler = async (e) => {
        e.preventDefault();

        const response = await axios.post("/api/member/updatestars", {
            id: data._id,
            amount: amount,
        });
        if (response.status === 200) {
            fetchdata();
        }
        setOpen(!open);
    };

    useEffect(() => {
        setAmount(data.stars);
    }, [data]);
    
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
                        Update User Stars
                        </h3>
                    </div>

                    <form onSubmit={submitHandler} className="px-4">
                        <div className="flex flex-col mt-8">
                            <label htmlFor="amount">Amount:</label>
                            <input
                                type="text"
                                name="amount"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="p-2 outline-none border" />
                        </div>

                        <div className="my-8 flex flex-row items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setOpen(!open)}
                                className="px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                className="ml-2 px-2 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white"
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
