import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const RegisterCard = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("submit fired");

    try {
      const response = await axiosInstance.post(
        "/auth/register",
        {
          email,
          username: userName,
          password,
        }
      );

      console.log(response);

      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
    }

    console.log(email, password, remember);
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen w-full flex items-center justify-center px-4 sm:px-6">

      {/* Main Card */}
      <div className="w-full max-w-6xl md:h-150 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div
          className="
            w-full md:w-[40%]
            min-h-75
            bg-[#151515]
            text-white
            flex flex-col
            justify-center
            px-10 sm:px-12
          "
        >
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

        {/* RIGHT SIDE */}
        <div className="w-full md:w-[60%] flex flex-col justify-center px-8 sm:px-14 py-10">

          {/* Header */}
          <div className="w-full flex flex-col gap-2 items-center justify-center mb-2">

            <Link
              to="/"
              className="text-2xl font-extrabold text-neutral-900"
            >
              Sarab<span className="text-blue-600">.</span>Fitness
            </Link>

            <h1 className="text-black text-3xl">
              Create Account
            </h1>

            <p className="text-gray-400">
              Please enter your details
            </p>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div>

              {/* Username */}
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-neutral-900 mb-2"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="
                  w-full
                  rounded-lg
                  border border-neutral-200
                  px-4 py-3
                  text-neutral-900
                  placeholder-neutral-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-neutral-800
                  focus:border-transparent
                "
              />

              {/* Email */}
              <label
                htmlFor="email"
                className="block mt-3 text-sm font-semibold text-neutral-900 mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  rounded-lg
                  border border-neutral-200
                  px-4 py-3
                  text-neutral-900
                  placeholder-neutral-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-neutral-800
                  focus:border-transparent
                "
              />

              {/* Password */}
              <label
                htmlFor="password"
                className="block mt-3 text-sm font-semibold text-neutral-900 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  rounded-lg
                  border border-neutral-200
                  px-4 py-3
                  text-neutral-900
                  placeholder-neutral-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-neutral-800
                  focus:border-transparent
                "
              />

              {/* Remember */}
              <div className="flex items-center justify-between gap-2 text-sm mt-4">

                <label className="flex items-center gap-2 cursor-pointer text-neutral-900">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="
                      w-4 h-4
                      rounded
                      border-neutral-300
                      text-neutral-900
                      focus:ring-neutral-800
                    "
                  />

                  Remember me
                </label>

              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="
                  w-full
                  cursor-pointer
                  bg-neutral-900
                  hover:bg-neutral-800
                  text-white
                  font-medium
                  rounded-lg
                  py-3
                  mt-6
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                "
              >
                Register
                <ArrowRight size={18} />
              </button>

            </div>
          </form>

          {/* Terms */}
          <p className="text-sm mt-5 text-center text-neutral-400">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>

          {/* Login Link */}
          <p className="text-sm mt-5 text-center text-neutral-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterCard;