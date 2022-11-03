import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import logoImg from "../res/imgs/Logo.png";

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showError, setMsgShow] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMsgShow(false);
        if(!username || !password){
            setErrorMsg("Please enter the login info!");
            setMsgShow(true);
            return;
        }
        
        const response = await axios.post("/api/auth/login", {
            username,
            password
        });
        
        if (response.data.status === 200) {
            sessionStorage.setItem("adminCookie", JSON.stringify(response.data.token));
            navigate("/");
        } else if (response.data.status === 403){
            setErrorMsg(response.data.message);
            setMsgShow(true);
        }

        // window.location.replace("/");
    };
    
    return (
        <form className="flex flex-col w-1/3 mx-auto mt-[10%] bg-[#2d353c]  text-white rounded-md overflow-hidden p-4" onSubmit={submitHandler}>
            <h1 className="text-2xl text-center font-semibold my-10">
                <img src={logoImg} alt="LinkedCord" width="75px" className="mx-auto" />
                <span>Admin Panel</span>
            </h1>
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-3 rounded relative" role="alert" style={{display: showError ? 'block' : 'none' }} >
                <span class="block sm:inline">{errorMsg}</span>
                <span class="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => {setMsgShow(false);}}>
                    <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
            <div className="flex flex-col">
                <label htmlFor="username">Your Username:</label>
                <input
                    type="text"
                    id="username"
                    className="rounded-md p-1 pl-3 text-[#2d353c]"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => { setMsgShow(false); setUsername(e.target.value) }}
                />
            </div>

            <div className="flex flex-col mt-4">
                <label htmlFor="password">Your Password:</label>
                <input
                    type="password"
                    id="password"
                    className="rounded-md p-1 pl-3 text-[#2d353c]"
                    placeholder="********"
                    value={password}
                    onChange={(e) => { setMsgShow(false); setPassword(e.target.value) }}
                />
            </div>

            <button type="submit" className="my-8 bg-white text-[#2d353c] rounded-md p-1 flex flex-row items-center justify-center hover:shadow-xl">
                <span>Login</span>
                <i className="fa fa-sign-in ml-2"></i>
            </button>
        </form>
    );
}
