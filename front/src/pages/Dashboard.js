import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  return (
    <section className="flex">
      <Sidebar />
      <div className="w-full">
        <Header title="Dashboard" />
        <Content />
      </div>
    </section>
  );
}

function Content() {

  const [users, setUsers] = useState(0);

  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/member");
      if (response.status === 200) {
        setUsers(response.data.length);
      }
    })();
  }, []);

  return (
    <div className="py-6 px-4">
      <div className="p-4 flex flex-row items-center justify-between text-white">
        <div className="w-1/4 md:w-full rounded-md mx-2 items-center overflow-hidden border border-[#2d353c] bg-[#2d353c] relative px-4 py-2">
          <span className="text-[#ADB5BD]">
            Total User
          </span>
          <span className="text-lg absolute right-4 bottom-2 text-6xl text-[#ADB5BD]">
            <i className="fa fa-user"></i>
          </span>
          <div className="text-lg text-4xl mt-4">
            { users }
          </div>
        </div>

        <div className="w-1/4 md:w-full rounded-md mx-2 items-center overflow-hidden border border-[#2d353c] bg-[#2d353c] relative px-4 py-2">
          <span className="text-[#ADB5BD]">
            Blocked User
          </span>
          <span className="text-lg absolute right-4 bottom-2 text-6xl text-[#ADB5BD]">
            <i className="fa fa-user-times"></i>
          </span>
          <div className="text-lg text-4xl mt-4">
            0
          </div>
        </div>

        <div className="w-1/4 md:w-full rounded-md mx-2 items-center overflow-hidden border border-[#2d353c] bg-[#2d353c] relative px-4 py-2">
          <span className="text-[#ADB5BD]">
            Total Sales
          </span>
          <span className="text-lg absolute right-4 bottom-2 text-6xl text-[#ADB5BD]">
            <i className="fa fa-line-chart"></i>
          </span>
          <div className="text-lg text-4xl mt-4">
            1200
          </div>
        </div>

        <div className="w-1/4 md:w-full rounded-md mx-2 items-center overflow-hidden border border-[#2d353c] bg-[#2d353c] relative px-4 py-2">
          <span className="text-[#ADB5BD]">
            Total Campaigns
          </span>
          <span className="text-lg absolute right-4 bottom-2 text-6xl text-[#ADB5BD]">
            <i className="fa fa-bullhorn"></i>
          </span>
          <div className="text-lg text-4xl mt-4">
            1225
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-row items-center justify-between mt-10">
        <div className="w-1/2">
          <h3 className="text-center text-xl font-semibold my-3 text-[#2d353c]">
            Users Data
          </h3>
          <Users />
        </div>
        <div className="w-1/2">
          <h3 className="text-center text-xl font-semibold my-3 text-[#2d353c]">
            Sales Data
          </h3>
          <Sales />
        </div>
      </div>
    </div>
  );
}

function Users() {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/member/getchart");
      if (response.status == 200) {
        setData(response.data);
      }
    })();
  }, []);

  return (
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="users" stroke="#2d353c" fill="#2d353c" />
    </AreaChart>
  );
}

function Sales() {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/payment/getchart");
      if (response.status == 200) {
        setData(response.data);
      }
    })();
  }, []);
  return (
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="sales" stroke="#2d353c" fill="#2d353c" />
    </AreaChart>
  );
}
