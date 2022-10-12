import Header from "../components/Header";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function Users() {
  return (
    <section className="flex">
      <Sidebar />
      <div className="w-full">
        <Header title="Users Management" />
        <Content />
      </div>
    </section>
  );
}

function Content() {
  const columns = [
    {
      name: "User Name",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Registerd at",
      selector: (row) => new Date(row.created_at).toDateString(),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => {
        return (
          <Link
            className="block p-3 bg-[#2d353c] hover:bg-[#446d14] text-[#ffffff] rounded-md"
            to={`/viewuser/${row._id}`}
          >
            View
          </Link>
        );
      },
    },
  ];
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/member");
      if (response.status === 200) {
        setUsers(response.data);
      }
    })();
  }, []);

  return (
    <div className="w-full min-h-screen  py-6 px-4">
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
              placeholder="Search By UserName"
              onChange={(e) => {
                setFilterText(e.target.value);
              }}
              className="outline-none py-2 pl-4"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users.filter(
            (item) =>
              item.username &&
              item.username.toLowerCase().includes(filterText.toLowerCase())
          )}
          pagination
          persistTableHead
        />
      </div>
    </div>
  );
}
