import React from "react";
import LiquidButton from "./LiquadButton";
import { loginUser } from "../redux/slices/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  return (
    <div className="p-5 bg-gray-100 shadow-md rounded-lg max-w-md mx-auto mt-20">
      <h2 className="text-center text-4xl font-semibold">Login</h2>
      <form>
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
            onchange={handleChange}
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
            onchange={handleChange}
          />
        </div>
        <LiquidButton text="Login" onClick={handleSubmit} />
      </form>
    </div>
  );
};

export default Login;
