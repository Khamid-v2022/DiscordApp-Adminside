import { NavLink } from "react-router-dom";
import logoImg from "../res/imgs/Logo.png";
import { useLayoutEffect } from "react";

export default function Sidebar() {
  const isAuthenticated = true;
  
  useLayoutEffect(() => {
    if (!isAuthenticated) window.location.replace("/login");
  }, []);

  return (
    <div className="w-[350px] min-w-[280px] min-h-screen bg-[#2d353c]">
      <div className="pt-4 pl-4">
        <NavLink to="/" className="flex items-center justify-start">
          <img src={logoImg} alt="LinkedCord" width="75px" />{" "}
          <span className="text-white text-2xl font-semibold">LinkedCord</span>
        </NavLink>
      </div>

      <nav className="mt-20">
        <NavLink
          end 
          to="/"
          className={({ isActive }) =>
            isActive ? "active-nav nav-item" : "nav-item"
          }
        >
           <i className="fa fa-tasks mr-2"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/user"
          className={({ isActive }) =>
            isActive ? "active-nav nav-item" : "nav-item"
          }
        >
          <i className="fa fa-users mr-2"></i>
          <span>User Management</span>
        </NavLink>
        <NavLink
          to="/payment"
          className={({ isActive }) =>
            isActive ? "active-nav nav-item" : "nav-item"
          }
        >
          <i className="fa fa-cc-mastercard mr-2"></i>
          <span>Payment Management</span>
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "active-nav nav-item" : "nav-item"
          }
        >
          <i className="fa fa-history mr-2"></i>
          <span>History Management</span>
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? "active-nav nav-item" : "nav-item"
          }
        >
          <i className="fa fa-sign-out mr-2"></i>
          <span>Logout</span>
        </NavLink>
      </nav>
    </div>
  );
}
