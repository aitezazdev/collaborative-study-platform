import { useState } from "react";
import LiquidGlassButton from "./LiquadButton";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, signInWithGoogle } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [userdata, setUserdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata({ ...userdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(registerUser(userdata)).unwrap();      
      toast.success("Registration Successful");
      navigate("/");
    } catch (err) {
      toast.error(err || "Registration Failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await dispatch(signInWithGoogle()).unwrap();    
      toast.success("Signed in with Google successfully");
      navigate("/");
    } catch (error) {
      toast.error(error || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Join us today and get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md group"
          >
            <FcGoogle className="text-2xl group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-gray-700">
              Continue with Google
            </span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">
              OR
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={userdata.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 text-xl" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={userdata.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 text-xl" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={userdata.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-xl" />
                  ) : (
                    <FiEye className="text-xl" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <p className="text-xs text-gray-600 leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:underline font-medium">
                Privacy Policy
              </a>
            </p>

            <LiquidGlassButton
              text={loading ? "Creating Account..." : "Create Account"}
            />
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Protected by reCAPTCHA and subject to the{" "}
          <a href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;