import React, { useState } from 'react'
import { ArrowRight } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";


const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    console.log("submit fired");

    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email, password
      })
      localStorage.setItem("accessToken", response.data.accessToken);
      console.log(response)
      if (response.data.user?.role === "admin") {
        navigate('/admin')
      } else {
        navigate('/home')
      }
    } catch (err) {
      console.log(err.response?.data);
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }
    console.log(email, password, remember);
  }

  return (
    <div className='bg-[#f7f7f7] min-h-screen w-full flex items-center justify-center flex-wrap px-4 sm:px-6'>
      <div className='w-full max-w-6xl md:h-150 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row'>
        <div className="w-full md:w-[40%] min-h-75
                bg-[#151515] text-white
                flex flex-col justify-center px-10 sm:px-12">

          <p className="text-blue-500 text-xs font-bold tracking-[0.15em] mb-5">
            SPORTS NUTRITION, SOURCED CLEAN
          </p>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.05]">
            Train hard.
            <br />
            Recover <span className="text-blue-500">harder.</span>
          </h1>

          <p className="text-neutral-400 mt-6 leading-relaxed">
            Genuine supplements, verified products and everything
            you need for the daily grind.
          </p>

        </div>
        <div className="w-full md:w-[60%] flex flex-col justify-center px-8 sm:px-14 py-12">
          <div className="w-full flex flex-col gap-2 items-center justify-center mb-8">
            <div className=' h-[70%] w-full pt-4 flex items-center justify-center'>
              <Link
                to="/"
                className="text-2xl font-extrabold text-neutral-900"
              >
                Sarab<span className="text-blue-600">.</span>Fitness
              </Link>
            </div>
            <h1 className='text-black text-3xl'>Welcome Back ! </h1>
            <p className='text-gray-400'>Please enter yout details</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div >
              <label htmlFor="email"
                className='block text-sm font-semibold text-neutral-900 mb-2'>
                Email Address
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                placeholder="" />

              <label htmlFor="password" className='block mt-4 text-sm font-semibold text-neutral-900 mb-2'>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full rounded-lg border border-neutral-200 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent'
                placeholder=''
              />
              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              )}
              <div className='flex tems-center justify-between gap-2 text-sm mt-4'>
                <label htmlFor="checkbox" className='flex items-center gap-2 text-sm cursor-pointer text-neutral-900'>
                  <input
                    type="checkbox"
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-800"
                  />
                  Remember me
                </label>
                <a href="#" className="text-neutral-400 hover:text-neutral-600">
                  Forgot Password?
                </a>

              </div>
              <button
                type="submit"
                className="w-full cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg py-3 mt-8 flex items-center justify-center gap-2 transition-colors"
              >
                Login
                <ArrowRight size={18} />
              </button>

            </div>
          </form>
          <p className='text-sm mt-6 text-center text-neutral-400'>By creating an account,you agree to our <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
            {" "}
          </a>and <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
              {" "}
            </a> </p>

          <p className='text-sm mt-6 text-center text-neutral-400'>
            Don't have account ? <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

      </div>

    </div>
  )
}

export default LoginCard