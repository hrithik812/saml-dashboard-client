'use client';
import React, { useState } from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import { url } from '../../../../apiEndpoint';

const page = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
      e.preventDefault();

      if (!oldPassword || !newPassword) {
          toast.error("Both fields are required!");
          return;
      }

      setLoading(true);

      try {
        const userId = localStorage.getItem("userId"); // Get user ID from localStorage
        if (!userId) {
            toast.error("User ID missing. Please log in again.");
            return;
        }

        const response = await axios.post(
            `${url}/auth/change-password`,
            { oldPassword, newPassword,userId },
        );

        toast.success("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
    } catch (error) {
         console.log("Error---",error);
         
        const errorMessage =
            error.response?.data?.message || "Failed to change password. Try again!";
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  return (
      <div className="flex items-center justify-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg lg:w-96 sm:w-[120px]">
              <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
              <form onSubmit={handleChangePassword}>
                  <div className="mb-4">
                      <label className="block text-gray-700">Old Password</label>
                      <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mt-1"
                      />
                  </div>

                  <div className="mb-4">
                      <label className="block text-gray-700">New Password</label>
                      <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mt-1"
                      />
                  </div>

                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full text-white p-2 rounded bg-[rgb(128,128,0)] hover:bg-[rgb(100,100,0)]"
                  >
                      {loading ? "Updating..." : "Change Password"}
                  </button>
              </form>
          </div>
      </div>
  )

}

export default page