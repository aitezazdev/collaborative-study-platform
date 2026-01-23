import { useState } from "react";
import LiquidGlassButton from "./LiquadButton";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [userdata, setUserdata] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata({ ...userdata, [name]: value });
    console.log(userdata);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser(userdata)).unwrap();

      setUserdata({
        name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="p-5 bg-gray-100 shadow-md rounded-lg max-w-md mx-auto mt-20">
      <h2 className="text-center text-4xl font-semibold">Get Started</h2>
      <form action="" onSubmit={handleSubmit}>
        <div className="my-3 flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            autoComplete="off"
            required
            className="outline-none px-3 py-2 border border-gray-300 rounded-md mx-2"
            name="name"
            type="text"
            placeholder="Your Name"
          />
        </div>
        <div className="my-3 flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            autoComplete="off"
            required
            className="outline-none px-3 py-2 border border-gray-300 rounded-md mx-2"
            name="email"
            type="text"
            placeholder="Your Email"
          />
        </div>
        <div className="my-3 flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            autoComplete="off"
            required
            className="outline-none px-3 py-2 border border-gray-300 rounded-md mx-2"
            name="password"
            type="password"
            placeholder="Your Password"
          />
        </div>
        <LiquidGlassButton text={loading ? "Registering..." : "Register"} />
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
