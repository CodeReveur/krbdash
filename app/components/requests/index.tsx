import React, { useEffect, useState } from "react";

interface Request {
  id: number;
  status: string;
  title: string;
  supervisor: string;
  reason: string;
  created_at: string;
  hashed_id: string;
}


const buttons = [
  {"id":1, "name": ""},
  {"id":2, "name": "Pending"},
  {"id":3, "name": "Approved"},
  {"id":4, "name": "Rejected"},
];

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
}

const RequestsApproval = () => {
  const [activeId, setActiveId] = useState(2);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] =useState("Pending");

  const handleActive = (id: number) => {
   setActiveId(id);
  }

  const toggleDropdown = (id: number) => {
   setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleSort = (text: string) => {
    setSort(text);
  }
  const handleFilter = (text: string) => {
    setFilter(text);
  }
  
  const handleSearch = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const { value } = e.target;
      setSearch((value));
  };

   // Fetch Researches
    useEffect(() => {
      const userSession = JSON.parse(localStorage.getItem('studentSession') || '{}');
      let session_id = "";
      if(userSession && userSession.id){
        session_id = userSession.id;
      }
      const fetchResearches = async () => {
        try {
          const response = await fetch(`/api/requests?sort=${sort}&search=${search}&filter=${filter}&session_id=${session_id}`);
          if (!response.ok) throw new Error("Failed to fetch researches");
          const data = await response.json();
          setRequests(data);
          console.log(data)
        } catch (error) {
          setError("An error occurred while fetching researches.");
        }
      };
      fetchResearches();
    }, [sort, filter, search]);

  return (
    <div className="border rounded-lg p-4 bg-white">

      <h4 className="text-slate-500 text-lg">Requests list</h4>


      <div className="flex justify-between my-1 items-center">
        <div className="flex items-center space-x-1 space-y-1">
          {buttons.map((btn) => (
            <button key={btn.id}  className={`${activeId === btn.id ? 'bg-slate-200 border-slate-400 ' : ''} px-2 py-1 capitalize border rounded-md text-slate-500 font-normal text-sm`} onClick={() => {handleActive(btn.id); handleFilter(btn.name)}}>{btn.name === "" ? 'All' : btn.name}</button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <i className="bi bi-funnel text-sm border px-2 py-1 rounded-md text-slate-500 cursor-pointer border-slate-300"></i>
          <div className="border py-1 px-2 bg-white rounded-md flex items-center">
            <i className="bi bi-search text-slate-400"></i>
            <input type="search" name="search" id="search" onChange={handleSearch} placeholder="Search ..." className="bg-transparent outline-none w-[15vw] px-3 text-sm"/>
          </div>
        </div>
      </div>
      {requests.length <= 0 ? (
<div className="w-full min-h-[30vh] flex items-center justify-center">
 <div className="flex flex-col justify-center items-center opacity-65">
   <div className="img w-[150px] h-[150px]">
    <img src="/delete.png" alt="" className="w-full h-full object-contain"/>
   </div>
   <i>No requests yet.</i>
 </div>
</div>
) : ( <>
        <table className="w-full mt-5">
          <thead className="space-x-2 border-t-2 border-b-2 border-slate-100 text-sm text-slate-400 p-2 text-left">
              <th className="py-2 px-2 font-normal">Type</th>
              <th className="py-2 px-2 font-normal">Title</th>
              <th className="py-2 px-2 font-normal">Supervisor</th>
              <th className="py-2 px-2 font-normal">Status</th>
              <th className="py-2 px-2 font-normal">Reason</th>
              <th className="py-2 px-2 font-normal">Created_at</th>
              <th className="py-2 px-2 font-normal">Actions</th>
          </thead>
          <tbody>
          {requests.map((request) => (
              <tr key={request.id} className="text-sm text-slate-800 border-b hover:bg-slate-100">
                <td className="py-2 px-2">{"Research Approval"}</td>
                <td className="py-2 px-2">{request.title}</td>
                <td className="py-2 px-2">{request.supervisor}</td>
                <td className="py-2 px-2"><span className={`${request.status === 'Approved' ? 'text-teal-500' : request.status === 'Rejected' ? 'text-red-500' : 'text-orange-500'}`}>{request.status}</span></td>
                <td className="py-2 px-2">{request.reason}</td>
                <td className={"py-2 px-2"}>{formatDate(request.title)}</td>
                <td className="py-2 px-6 relative">
              <i
                className="bi bi-three-dots cursor-pointer text-xl"
                onClick={() => toggleDropdown(request.id)}
              ></i>
              {dropdownOpen === request.id && (
                <div className="absolute right-0 mt-0 mr-1 w-36 bg-white border rounded-md shadow-lg z-10">
                  <ul className="text-gray-700">
                    <li 
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        //onrequestView(request.hashed_id); // Assign the Order
                        toggleDropdown(request.id); // Close the dropdown
                      }}
                    >
                      <i className="bi bi-info-circle mr-2 text-teal-500 hover:bg-slate-100"></i> Details
                    </li>
                    <li 
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        //onrequestView(request.hashed_id); // Assign the Order
                        toggleDropdown(request.id); // Close the dropdown
                      }}
                    >
                      <i className="bi bi-clock mr-2 text-orange-500 hover:bg-slate-100"></i> Remind
                    </li>
                  </ul>
                </div>
              )}
            </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex space-x-1 my-2 justify-self-end text-slate-500">
          <button className="px-2 py-1 border border-slate-300 rounded-md text-sm">Previous</button>
          <button className="px-3 py-1 border border-red-500 bg-red-400 text-white rounded-md text-sm">1</button>
          <button className="px-2 py-1 border border-slate-300 rounded-md text-sm">Next</button>
        </div>
        </>
      )}
    </div>
  );
}
export default RequestsApproval;
