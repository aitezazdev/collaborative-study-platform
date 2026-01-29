import { useState, useEffect } from "react";
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
  const [localError, setLocalError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata({ ...userdata, [name]: value });
    
    if (localError) {
      setLocalError("");
    }
    
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!userdata.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!userdata.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!userdata.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    } else if (userdata.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(registerUser(userdata)).unwrap();
      toast.success("Registration Successful");
      navigate("/");
    } catch (err) {
      setLocalError(err || "Registration Failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await dispatch(signInWithGoogle()).unwrap();
      toast.success("Signed in with Google successfully");
      navigate("/");
    } catch (error) {
      setLocalError(error || "Google sign-in failed");
    }
  };

  const handleNavigateToLogin = () => {
    setLocalError("");
    setFieldErrors({ name: "", email: "", password: "" });
    setUserdata({ name: "", email: "", password: "" });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-zinc-900 mb-2">
            Create Account
          </h2>
          <p className="text-zinc-600 text-sm">Join our learning community today</p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-zinc-300 rounded-lg bg-white hover:bg-zinc-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-xl" />
            <span className="font-medium text-zinc-700">
              Continue with Google
            </span>
          </button>

          <div className="flex items-center">
            <div className="flex-1 border-t border-zinc-200"></div>
            <span className="px-4 text-zinc-500 text-sm">OR</span>
            <div className="flex-1 border-t border-zinc-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-zinc-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userdata.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all text-zinc-900 ${
                    fieldErrors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
              </div>
              {fieldErrors.name && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-zinc-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userdata.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all text-zinc-900 ${
                    fieldErrors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-zinc-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={userdata.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition-all text-zinc-900 ${
                    fieldErrors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                      : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-600 text-xs mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {localError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">
                {localError}
              </div>
            )}

            <LiquidGlassButton
              text={loading ? "Creating Account..." : "Create Account"}
            />
          </form>

          <div className="text-center pt-4 border-t border-zinc-200">
            <p className="text-zinc-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={handleNavigateToLogin}
                className="text-blue-600 font-semibold hover:text-blue-700 underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;