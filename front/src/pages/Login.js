import logoImg from "../res/imgs/Logo.png";

export default function Login() {
    const submitHandler = async (e) => {
        e.preventDefault();

        window.location.replace("/");
    };
    
    return (
        <form className="flex flex-col w-1/3 mx-auto mt-[10%] bg-[#2d353c]  text-white rounded-md overflow-hidden p-4" onSubmit={submitHandler}>
            <h1 className="text-2xl text-center font-semibold my-10">
                <img src={logoImg} alt="LinkedCord" width="75px" className="mx-auto" />
                <span>Admin Panel</span>
            </h1>
            <div className="flex flex-col">
                <label htmlFor="username">Your Username:</label>
                <input
                    type="text"
                    id="username"
                    className="rounded-md p-1 pl-3 text-[#2d353c]"
                    placeholder="johndoe"
                />
            </div>

            <div className="flex flex-col mt-4">
                <label htmlFor="password">Your Password:</label>
                <input
                    type="text"
                    id="password"
                    className="rounded-md p-1 pl-3 text-[#2d353c]"
                    placeholder="********"
                />
            </div>

            <button className="my-8 bg-white text-[#2d353c] rounded-md p-1 flex flex-row items-center justify-center hover:shadow-xl">
                <span>Login</span>
                <i className="fa fa-sign-in ml-2"></i>
            </button>
        </form>
    );
}
