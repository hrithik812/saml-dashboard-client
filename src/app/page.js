'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { url } from '../../apiEndpoint';
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [loading,setLoading]=useState(false)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic client-side validation
    if (!username || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
  
    try {
      setLoading(true);
      // Call backend API for authentication
      const response = await axios.post(`${url}/auth/login`, {
        username,
        password,
      });
      const { token } = response.data; // Extract the token from the API response
        
      
      // Set the token in cookies
      Cookies.set('authToken', token, { 
        expires: 1, // Cookie expiration in days  
        sameSite: 'Strict', // SameSite attribute
      });
        
      localStorage.setItem('username', response?.data?.feature?.username); // Store username in localStorage
      localStorage.setItem('userId', response?.data?.userId); // Store username in localStorage
      setLoading(false)

      // Handle successful authentication
      toast.success('Login successful!');
      router.push('/dashboard'); // Redirect to dashboard on success
    } catch (error) {
      setLoading(false)
      if (error.response) {
        // Extract error message from API response
        const errorMessage = error.response.data.message || 'Authentication failed. Please try again.';
        toast.error(errorMessage);
      } else {
        // Handle network or other unexpected errors
        console.error('Error during authentication:', error);
        toast.error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://cms.shanta-aml.com/admin/uploads/page/home/1705210090pjHKK.jpg')",
      }}
    >
      <div className="w-full max-w-sm p-6 bg-white bg-opacity-90 rounded-lg shadow-md">
        <div className="flex justify-center items-center">
          <Image
            src="https://www.shanta-aml.com/images/static/logo-white.png"
            alt="Shanta Asset Management Limited"
            width={200}
            height={200}
            className="filter invert hue-rotate-180"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">UserName</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <button
  type="submit"
  className="w-full py-2 px-4 text-white bg-[rgb(128,128,0)] rounded-md hover:bg-[rgb(100,100,0)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(128,128,0)]"
  disabled={loading}
>
  {loading?"Logging":"Login"}
</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;