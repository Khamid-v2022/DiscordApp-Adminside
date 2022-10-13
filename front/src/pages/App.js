import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import History from "./History";
import Login from "./Login";
import Payments from "./Payments";
import Addpayment from "./Addpayment";
import Users from "./Users";
import ViewUser from "./ViewUser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/user" element={<Users />} />
      <Route path="/viewuser/:id" element={<ViewUser />} />
      <Route path="/history" element={<History />} />
      <Route path="/payment" element={<Payments />} />
      <Route path="/addpayment" element={<Addpayment />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
