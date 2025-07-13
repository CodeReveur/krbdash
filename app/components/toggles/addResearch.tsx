import React, { useEffect, useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle, AlertCircle, Sparkles, BookOpen, Building, Calendar, School, FileUp } from "lucide-react";
import AlertNotification from "../app/notify";

// Define the AlertNotification component type
interface AlertNotificationProps {
  message: string;
  type: 'error' | 'success';
}

interface AddResearchProps {
  onClose?: () => void;
}

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

const AddResearch: React.FC<AddResearchProps> = ({ onClose = () => {} }) => {
  const [formData, setFormData] = useState({
    title: "",
    researcher: "",
    category: "",
    status: "",
    year: "",
    abstract: "",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file size (10MB max)
      if (selectedFile.size > 512 * 1024 * 1024) {
        setError("File size must be less than 500MB");
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Only PDF, DOC, and DOCX files are allowed");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please upload a document");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Get user info from localStorage (adjust this based on your auth system)
      const userInfoData = JSON.parse(localStorage.getItem('userSession') || '{}');
      let userId;
      if(userInfoData && userInfoData.id) {
        userId = userInfoData.id;
      } else {
        setError("Error: Can't find your credentials, please login to upload");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('researcher', formData.researcher);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('year', formData.year);
      formDataToSend.append('abstract', formData.abstract);
      formDataToSend.append('user_id', userId);
      formDataToSend.append('document', file);
      
      // Note: We're not sending institution and school as per your backend requirements
      // These were removed from the backend API

      const response = await fetch('/api/add/research', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload research');
      }

      setSuccess("Research uploaded successfully! 🎉");
      setLoading(false);
      
      // Clear form
      setFormData({
        title: "",
        researcher: "",
        category: "",
        status: "",
        year: "",
        abstract: "",
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch(step) {
      case 1:
        return formData.title !== "" && formData.researcher !== "" && formData.category !== "";
      case 2:
        return formData.status !== "" && formData.year !== "";
      case 3:
        return formData.abstract !== "" && file !== null;
      default:
        return false;
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .gradient-border {
          background: linear-gradient(135deg, #14b8a6 0%, #0891b2 50%, #6366f1 100%);
          padding: 2px;
          border-radius: 1rem;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .floating {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      {error && <AlertNotification message={error} type="error" />}
      {success && <AlertNotification message={success} type="success" />}
      
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4 ${showModal ? 'animate-fade-in' : ''}`}>
        <div ref={modalRef} className="gradient-border w-full max-w-3xl max-h-[90vh] animate-scale-in">
          <div className="glass-effect rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-full floating">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Upload Research Material</h2>
                  <p className="text-white/80 text-sm">Share your knowledge with the community</p>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep >= step ? 'bg-white text-teal-600 scale-110' : 'bg-white/20 text-white/60'
                    }`}>
                      {currentStep > step ? <CheckCircle size={20} /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 rounded transition-all duration-500 ${
                        currentStep > step ? 'bg-white' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('title')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-all duration-300 peer"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:text-teal-500 peer-focus:-top-2.5 peer-focus:bg-white peer-focus:px-2 peer-focus:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-sm">
                        Research Title <span className="text-red-500">*</span>
                      </label>
                      {focusedField === 'title' && <div className="absolute inset-0 rounded-lg shimmer pointer-events-none" />}
                    </div>
                    
                    <div className="relative group">
                      <input
                        id="researcher"
                        type="text"
                        value={formData.researcher}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('researcher')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-all duration-300 peer"
                        placeholder=" "
                        required
                      />
                      <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:text-teal-500 peer-focus:-top-2.5 peer-focus:bg-white peer-focus:px-2 peer-focus:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-sm">
                        Researcher Name <span className="text-red-500">*</span>
                      </label>
                      {focusedField === 'researcher' && <div className="absolute inset-0 rounded-lg shimmer pointer-events-none" />}
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('category')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-all duration-300 appearance-none peer"
                      required
                    >
                      <option value=""></option>
                      {researchTopics.map((topic, i) => (
                        <option key={i} value={topic}>{topic}</option>
                      ))}
                    </select>
                    <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:text-teal-500 peer-focus:-top-2.5 peer-focus:bg-white peer-focus:px-2 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-sm">
                      Research Category <span className="text-red-500">*</span>
                    </label>
                    {focusedField === 'category' && <div className="absolute inset-0 rounded-lg shimmer pointer-events-none" />}
                  </div>
                </div>
              )}
              
              {/* Step 2: Research Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <select
                        id="status"
                        value={formData.status}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('status')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-all duration-300 appearance-none peer"
                        required
                      >
                        <option value=""></option>
                        <option value="ongoing">🔄 Ongoing</option>
                        <option value="completed">✅ Completed</option>
                        <option value="published">🔥 Published</option>
                      </select>
                      <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:text-teal-500 peer-focus:-top-2.5 peer-focus:bg-white peer-focus:px-2 peer-focus:text-sm peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-sm">
                        Progress Status <span className="text-red-500">*</span>
                      </label>
                      {focusedField === 'status' && <div className="absolute inset-0 rounded-lg shimmer pointer-events-none" />}
                    </div>
                    
                    <div className="relative group">
                      <input
                        id="year"
                        type="text"
                        value={formData.year}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('year')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-all duration-300 peer"
                        placeholder=" "
                        pattern="[0-9]{4}"
                        maxLength={4}
                        required
                      />
                      <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:text-teal-500 peer-focus:-top-2.5 peer-focus:bg-white peer-focus:px-2 peer-focus:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-sm">
                        <Calendar size={16} className="inline mr-1" />
                        Year <span className="text-red-500">*</span>
                      </label>
                      {focusedField === 'year' && <div className="absolute inset-0 rounded-lg shimmer pointer-events-none" />}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Document & Abstract */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-teal-50 rounded-full group-hover:bg-teal-100 transition-colors">
                          {file ? (
                            <CheckCircle size={32} className="text-teal-600" />
                          ) : (
                            <FileUp size={32} className="text-teal-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            {file ? file.name : "Click to upload document"}
                          </p>
                          <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      id="abstract"
                      value={formData.abstract}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('abstract')}
                      onBlur={() => setFocusedField('')}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-all duration-300 resize-none peer"
                      placeholder=" "
                      required
                    />
                    <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:text-teal-500 peer-focus:-top-2.5 peer-focus:bg-white peer-focus:px-2 peer-focus:text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:text-sm">
                      Abstract <span className="text-red-500">*</span>
                    </label>
                    {focusedField === 'abstract' && <div className="absolute inset-0 rounded-lg shimmer pointer-events-none" />}
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : onClose()}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {currentStep === 1 ? 'Cancel' : 'Previous'}
                </button>
                
                <div className="flex items-center gap-4">
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      disabled={!isStepValid(currentStep)}
                      className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        isStepValid(currentStep)
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Next
                      <Sparkles size={16} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!isStepValid(3) || loading}
                      onClick={handleSubmit}
                      className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                        isStepValid(3) && !loading
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Upload Research
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddResearch;