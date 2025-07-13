"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Preloader from "../app/buttonPreloader";
import AlertNotification from "../app/notify";

interface FormData {
  hashed_id: string;
  password: string;
  confirm: string;
}

interface Props {
  hashed: string;
}

const ChangePassword = ({ hashed }: Props) => {
  const [focus, setFocus] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    hashed_id: hashed,
    password: "",
    confirm: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleFocus = (field: string) =>
    setFocus((prev) => ({ ...prev, [field]: true }));

  const handleBlur = (field: string, value: string) =>
    setFocus((prev) => ({ ...prev, [field]: value.trim().length > 0 }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.password !== formData.confirm) {
        setLoading(false);
        setError("Password does not match!");
        return;
      }

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setLoading(false);
        setSuccess("Password changed successfully! ✅");
        setFormData({
          password: "",
          hashed_id: "",
          confirm: "",
        });
      } else {
        setLoading(false);
        const errorData = await response.json();
        setError(errorData.message || "An error occurred");
      }
    } catch (error) {
      setLoading(false);
      setError(`Changing password failed! ${(error as Error).message}`);
    }
  };

  if (success?.includes("success")) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-100 p-4">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-teal-100/50 overflow-hidden z-10 transition-all duration-500 hover:shadow-xl hover:border-teal-200">
        
        {/* Teal Gradient Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-900 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              {/* Password Change Icon */}
              <div className="bg-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Change Password</h1>
          <p className="text-white/90 mt-1">Create a new secure password</p>
        </div>

        <div className="p-8">
          {error && <AlertNotification message={error} type="error" />}
          {success && <AlertNotification message={success} type="success" />}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {[
              { id: "password", label: "New password", type: "password" },
              { id: "confirm", label: "Confirm password", type: "password" }
            ].map((field) => (
              <div key={field.id} className="relative">
                <input
                  id={field.id}
                  type={field.type}
                  className="w-full px-4 py-3 bg-white/90 rounded-lg border border-teal-100 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                  onFocus={() => handleFocus(field.id)}
                  onBlur={(e) => handleBlur(field.id, e.target.value)}
                  value={(formData as any)[field.id]}
                  onChange={handleChange}
                  required
                  placeholder=" "
                />
                <label
                  htmlFor={field.id}
                  className={`absolute left-4 text-gray-500 transition-all duration-300 pointer-events-none ${
                    focus[field.id] || (formData as any)[field.id]
                      ? "top-[-10px] text-xs bg-gradient-to-r from-teal-600 to-cyan-500 text-white px-2 py-0.5 rounded-md"
                      : "top-3 text-base"
                  }`}
                >
                  {field.label}
                  <span className="text-red-300 ml-1">*</span>
                </label>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-600 hover:to-cyan-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-teal-200 transition-all duration-300"
            >
              {loading ? (
                <Preloader />
              ) : (
                <>
                  <span>Change Password</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <button
                onClick={() => router.push('/auth/login')}
                className="text-teal-600 font-medium hover:text-teal-700 transition-colors"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>

        <div className="bg-teal-50 p-4 text-center border-t border-teal-100">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Kamero Research Base. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;