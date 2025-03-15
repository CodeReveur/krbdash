"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import Preloader from "../app/buttonPreloader";
import AlertNotification from "../app/notify";


const researchTopics = [
  "Health Research",
  "Agriculture and Environmental Research",
  "Education and Social Sciences",
  "Energy and Infrastructure",
  "Information and Communication Technology (ICT)",
  "Industry and Manufacturing",
  "Natural and Basic Sciences",
  "Tourism and Cultural Heritage",
  "Policy and Governance",
  "Innovation and Technology Transfer",
  "Pest surveillance and management",
  "Sustainable farming practices",
  "Crop diversification",
  "Food systems",
  "Biofortification",
  "HIV/AIDS and other sexually transmitted infections",
  "Reproductive health and family planning",
  "Infectious diseases (e.g., malaria, Ebola, Marburg virus)",
  "Occupational safety and health in agriculture",
  "Advanced surgical techniques",
  "Higher education development",
  "Access to education in rural areas",
  "Educational technology integration",
  "Curriculum development",
  "Electronic case management systems",
  "Digital transformation in public services",
  "Artificial intelligence applications",
  "Post-genocide reconciliation and justice",
  "Social equity in healthcare",
  "Gender studies",
  "Community development",
  "Climate change adaptation",
  "Biodiversity conservation",
  "Sustainable urban planning",
  "Water resource management",
  "Trade and market dynamics",
  "Infrastructure development",
  "Social protection programs",
  "Energy sector growth",
  "Policy strengthening in labor sectors",
  "Public administration reforms",
  "Legal system effectiveness"
];

interface Research {
  id: string | any;
  title: string;
  researcher: string;
  category: string;
  institute: string;
  status: string;
  progress_status: string;
  school: string;
  year: string;
  abstract: string;
  document: string | any;
  document_type: string;
  hashed_id: any;
  institute_id: any;
  school_id: any;
  created_at: string;
  approval_requested: boolean;
};

interface FormData {
  title: string;
  researcher: string;
  category: string;
  institution: string;
  status: string;
  school: string;
  year: string;
  abstract: string;
};


  const buttons = [
    {"name": "details"},
    {"name": "supervisors"},
    {"name": "institution"},
    {"name": "billing"},
  ];

  interface School {
    id: number;
    name: string;
  };
  
  interface Institution {
    id: number;
    name: string;
  }

interface ViewResearchProps{
  ResearchId: string;
  onClose: () => void;
}

function formatDate(dateString: any) {
  // Convert the string to a Date object
  const date = new Date(dateString);

  // Array of month names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Extract parts of the date
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Construct the formatted date
  return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
}

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text; // Return the original text if it's within the limit
}

const ViewResearch: React.FC<ViewResearchProps> = ({ResearchId, onClose }) => { 

  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [research, setResearch] = useState<Research | null>(null);
  const [editMode, setEditMode] = useState(false);  // Add state to manage edit mode
  const [formData, setFormData] = useState<FormData>({
    title: "",
    researcher: "",
    category: "",
    institution: "",
    status: "",
    school: "",
    year: "",
    abstract: "",
  });
  const [schools, setSchools] = useState<School[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);


    // Function to clear messages after a few seconds
    useEffect(() => {
      if (error || success) {
        const timer = setTimeout(() => {
          setError(null);
          setSuccess(null);
        }, 10000); // Hide after 4 seconds
        return () => clearTimeout(timer);
      }
    }, [error, success]);


   const handleActive = (id: number) => {
    setActiveId(id);
   }
  // Fetch Researches
  useEffect(() => {
    const fetchResearch = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/research/view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id: ResearchId }), // Use resolved ID
        });
        if (!response.ok) throw new Error("Failed to fetch researches");
        const data = await response.json();
        setResearch(data);
       // setFormData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("An error occurred while fetching researches.");
      }
    };
    fetchResearch();
  }, []);


  const handleChange = (
     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
     const { id, value } = e.target;
     setFormData((prev) => ({ ...prev, [id]: value }));
   };
  // Fetch institutions
  useEffect(() => {

    const fetchInstitutions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/institution");
        if (!response.ok) throw new Error("Failed to fetch institutions");
        const data = await response.json();
        setInstitutions(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("An error occurred while fetching institutions.");
      }
    };
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/schools");
        if (!response.ok) throw new Error("Failed to fetch Schools");
        const data = await response.json();
        setSchools(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("An error occurred while fetching Schools.");
      }
    };
    fetchSchools();
    fetchInstitutions();

    if (typeof window !== "undefined") {
      // ✅ Ensure it runs only on the client
      const abstract = document.getElementById("abstract") as HTMLDivElement;
      if (abstract && research?.abstract) {
        abstract.innerHTML = research.abstract;
      }
    }
  
    let quillInstance: any = null;
  
    import("quill").then((QuillModule) => {
      const Quill = QuillModule.default; // ✅ Access the default export
  
      quillInstance = new Quill("#editor", {
        theme: "snow",
        modules: {
          toolbar: "#toolbar",
        },
      });
  
      // ✅ Set Default Value
      const defaultValue = research?.abstract;
      quillInstance.root.innerHTML = defaultValue;
  
      // ✅ Alternative Method (If using Delta format)
      // quillInstance.setContents([{ insert: "This is the default text.\n" }]);
  
      quillInstance.on("text-change", () => {
        setFormData((prev) => ({
          ...prev,
          abstract: quillInstance.root.innerHTML,
        }));
      });
    });
  
    return () => {
      if (quillInstance) {
        quillInstance.off("text-change");
      }
    };
  }, [research]); // ✅ Add research as a dependency
  

  const handleNotify = async (id: any,) => {
    setLoading(true);
    const response = await fetch(`/api/research/notify`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({id: id}),
    });
  
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to approve. Server returned an error without JSON.");
            return;
        }
        setLoading(false);
        setError(errorData.message || "Failed to approve");
        return;
        
    }

  };

  useEffect(() => {
    if (research) {
      setFormData({
        title: research.title || "N/A",
        researcher: research.researcher || "N/A",
        category: research.category || "N/A",
        institution: research.institute_id || "N/A",
        status: research.status || "N/A",
        school: research.school_id || "N/A",
        year: research.year || "N/A",
        abstract: research.abstract || "N/A",
      });
    }
  }, [research]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileNameDisplay = document.getElementById("file-name");
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setFile(file);
      if (fileNameDisplay) {
        fileNameDisplay.textContent = file.name;
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) payload.append(key, value as string);
    });
    if (file) {
      payload.append("document", file);
    }
    const userSession = JSON.parse(localStorage.getItem('studentSession') || '{}');
    let session_id = "";
    if(userSession && userSession.id){
      session_id = userSession.id;
      payload.append('user_id', session_id);
    }
    payload.append("research_id", research?.id);
    payload.append("current_file", research?.document)

    try {

      const response = await fetch("/api/add/research/edit", {
        method: "POST",
        body: payload,
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setFile(null);
        setLoading(false);
        document.location.reload();
      } else {
        const error = await response.json();
        setError(`${error.message}`);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(`${(error as Error).message}`);
    }
  };

  const handleEditClick = () => {
    setEditMode(!editMode); // Toggle edit mode when button clicked
    if(editMode) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed flex justify-center items-center bg-slate-400 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-[6px] py-[2px] border top-7 text-2xl font-bold cursor-pointer text-teal-50 bg-teal-500 border-teal-300 hover:bg-teal-200 hover:border rounded-full"
      ></i>
      {/* Notification Component */}
      {error && <AlertNotification type="error" message={error} />}
      {success && <AlertNotification type="success" message={success} />}
      <div className="w-4/5 bg-slate-100 rounded-lg p-4">
        <h4 className="flex justify-between items-center p-3">
          <div>
           <h1 className="text-sm text-slate-400">RESEARCH HEADER {loading ? '( loading... )' : ''}</h1>
           <span className="text-2xl text-slate-700 font-medium">{truncateText(research?.title ?? "" , 40)} </span> 
          </div>
          <div className="flex space-x-3">
            <button className="border border-teal-800 py-[6px] px-6 rounded-md text-sm bg-teal-500 text-white text-center" onClick={() => { handleNotify(research?.hashed_id); }}>Notify supervisor</button>
            <button className="border border-teal-800 py-[6px] px-6 rounded-md text-sm bg-sky-500 text-white text-center flex items-center justify-center" onClick={handleEditClick} disabled={loading }>
              {loading && <Preloader/>}
              <span>{editMode ? "Update" : "Edit"}</span>
            </button>
          </div>
        </h4>
        <div className="flex space-x-4 px-3">
          {buttons.map((button, index) => (
            <button key={index} onClick={() => handleActive(index)} className={`py-[6px] px-4 border-b capitalize hover:border-teal-500 ${activeId === index ? 'border-teal-500': ''}`}>{button.name}</button>
          ))}

        </div>
        <form className="space-y-2 max-h-[70vh] overflow-hidden overflow-y-visible">
        
        <div className="flex justify-between p-2 space-x-3">
          <div className="w-5/6 bg-white rounded-lg p-5">
           <div className="w-full flex items-center justify-center bg-slate-100 p-2">
            <i className="bi bi-search text-5xl text-slate-400"></i>
           </div>
           <div className="space-y-6 px-1">

               <div className="relative">
                  <h4 className="font-medium pt-2">Title</h4>
                  {editMode ? (
                    <input
                      type="text"
                      id="title"
                      value={formData?.title || ""}
                      onChange={handleChange}
                      className="w-full my-1 rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                    />
                  ) : (
                    <div className="relative text-gray-700 transition-all duration-300">{research?.title}</div>
                  )}
                </div>

            <div className="relative">
              <h4 className="font-medium">Abstract </h4>
              <div
                id="editor-container"
                className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparent focus:border-teal-500 focus:outline-none appearance-none transition-colors"
              >
                {/* Toolbar Section */}
                <div id="toolbar" className="rounded-t-lg border-b-0">
                  <select className="ql-header">
                   <option value="1"></option>
                   <option value="2"></option>
                   <option selected></option>
                  </select>
                  <button className="ql-bold"></button>
                  <button className="ql-italic"></button>
                  <button className="ql-underline"></button>
                  <button className="ql-strike"></button>
                  <button className="ql-list" value="ordered"></button>
                  <button className="ql-list" value="bullet"></button>
                  <button className="ql-link"></button>
                </div>

                {/* Editor Section */}
                <div className="relative">
                  <div
                    id="editor"
                    aria-placeholder="Write the Abstract here..."
                    className="w-full border border-t-0 rounded-b-md border-gray-300 px-3 bg-transparent focus:border-teal-500 focus:outline-none appearance-none transition-colors"
                  ></div>
                </div>
              </div>

            </div>

            <div className="relative">
              <h4 className="font-medium pt-2">Document</h4>
              {editMode ? (
                <div className="flex space-x-2 items-center w-full border rounded-md p-1">
                  
                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                  />
                  <label  htmlFor="file-upload" id="file-upload-trigger" className="w-max rounded-md bg-teal-400 text-white border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors">
                    <i className="bi bi-upload"></i> Upload 
                  </label>
                  <span id="file-name" className="text-sm text-gray-500"></span>
                </div>
                  ) : (
              <div className={`relative text-gray-700 transition-all duration-300`}>
               <Link href={research?.document ?? ""} className="text-teal-600 underline">{truncateText(research?.document ?? "" , 80)}</Link> 
              </div>
              )}
            </div>
            
           </div>
          </div>
          <div className="w-2/6 bg-white rounded-lg p-5 space-y-2 h-max">
           <h1 className="text-lg text-slate-600 font-semibold">Research Details</h1>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Status</h4>
            {editMode ? (
              <select
              id="status"
              className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value={research?.status} selected disabled>{research?.status}</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            ) : (
             <div className="text-sm tex-slate-600">{research?.progress_status}</div>
            )}
              
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Researcher</h4>
                 {editMode ? (
                    <input
                      type="text"
                      id="researcher"
                      value={formData?.researcher || ""}
                      onChange={handleChange}
                      className="w-full my-1 rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                    />
                  ) : (
                   <div className="text-sm tex-slate-600">{research?.researcher}</div>
                  )}
          </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">University</h4>
            {editMode ? (
              <select
              id="institution"
              className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
              value={formData.institution}
              onChange={handleChange}
              required
            >
              <option value={research?.institute_id} disabled>{research?.institute}</option>
              {institutions.map((institute) => (
                   <option key={institute.id} value={institute.id}>{institute.name}</option>
              ))}
            </select>
            ) : (
             <div className="text-sm tex-slate-600">{research?.institute}</div>
            )}
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Category</h4>
            {editMode ? (
              <select
              id="category"
              className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value={research?.category} disabled>{research?.category}</option>
              {researchTopics.map((topic, i) => (
                <option key={i} value={topic}>{topic}</option>
              ))}
            </select>
            ) : (
             <div className="text-sm tex-slate-600">{research?.category}</div>
            )}
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Year</h4>
                 {editMode ? (
                    <input
                      type="text"
                      id="year"
                      value={formData?.year || ""}
                      onChange={handleChange}
                      className="w-full my-1 rounded-md border border-gray-300 px-3 py-2 focus:border-teal-400 focus:outline-none transition-colors"
                    />
                  ) : (
                   <div className="text-sm tex-slate-600">{research?.year}</div>
                  )}
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">School </h4>
            {editMode ? (
              <select
              id="school"
              className="w-full border rounded-md border-gray-300 px-3 py-2 bg-transparen2 focus:border-teal-500 focus:outline-none appearance-none transition-colors"
              value={formData.school}
              onChange={handleChange}
              required
            >
              <option value={research?.school_id} disabled>{research?.school}</option>
              {schools.map((school) => (
                   <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
            ) : (
             <div className="text-sm tex-slate-600">{research?.school}</div>
            )}
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Document Type</h4>
            <div className="text-sm tex-slate-600">{research?.document_type}</div>
           </div>

           <div className="space-y-1">
            <h4 className="text-xs text-slate-500">Uploaded at</h4>
            <div className="text-sm tex-slate-600">{formatDate(research?.created_at)}</div>
           </div>

          </div>
        </div>
        </form>
      
      </div>
    </div>
  )
}
export default ViewResearch;