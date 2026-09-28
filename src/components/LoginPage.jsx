import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, remember });
  };

  return (
    <div className="min-h-screen w-full bg-neutral-200 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left: image panel */}
        <div className="md:w-1/2 h-64 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=1200&q=80"
            alt="Modern building facade"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        {/* Right: form panel */}
        <div className="md:w-1/2 flex flex-col justify-center px-8 sm:px-12 py-12">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" fill="#1a1a1a" />
              <circle cx="22" cy="32" r="14" fill="#d4d4d4" />
              <circle cx="34" cy="32" r="14" fill="#ffffff" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 text-center">
            Welcome Back !
          </h1>
          <p className="text-neutral-400 text-center mt-2 mb-8">
            Please enter your details
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-900 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                placeholder=""
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-neutral-900 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-transparent"
                placeholder=""
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
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
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
            >
              Login
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-sm text-neutral-400 text-center mt-6 leading-relaxed">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>

          <p className="text-sm text-neutral-500 text-center mt-4">
            Don&apos;t have an account?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
