import React from "react";
import LiquidButton from "./LiquadButton";
import { loginUser } from "../redux/slices/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(userData)).unwrap();
      setUserData({
        email: "",
        password: "",
      });

      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Login Failed");
    }
  };
  return (
    <div className="p-5 bg-gray-100 shadow-md rounded-lg max-w-md mx-auto mt-20">
      <h2 className="text-center text-4xl font-semibold">Login</h2>
      <form  onSubmit={handleSubmit}>
        <div className="my-6 flex flex-col">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            autoComplete="off"
            className="outline-none px-3 py-2 border border-gray-300 rounded-md mx-2"
            id="email"
            name="email"
            required
            placeholder="Your Name"
            onChange={handleChange}
          />
        </div>
        <div className="my-6 flex flex-col">
          <label htmlFor="password">Password:</label>
          <input
            autoComplete="off"
            className="outline-none px-3 py-2 border border-gray-300 rounded-md mx-2"
            type="password"
            id="password"
            name="password"
            required
            placeholder="Your Password"
            onChange={handleChange}
          />
        </div>
        <LiquidButton text={loading ? "Logging in..." : "Login"} />
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?
          <Link
            to="/register"
            className="text-blue-500 mx-1 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
      
    </div>
  );
};

export default Login;
