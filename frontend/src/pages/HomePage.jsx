import React, { useState } from "react";
import LiquidGlassButton from "../components/LiquadButton";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreateClass from "../components/ui/CreateClass";
import JoinClass from "../components/ui/JoinClass";

const HomePage = () => {
  const reduxUser = useSelector((state) => state.auth.user);
  const localUser = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const user = reduxUser || localUser;
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const openCreateModal = () => {
    setActiveModal("create");
  };

  const openJoinModal = () => {
    setActiveModal("join");
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLogout = () => {
    try {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 p-4 shadow bg-gray-100 flex flex-col">
        <div>
          <div>
            <div className="w-16 h-16 bg-blue-500 rounded-full mb-2"></div>
            <h2 className="text-lg font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Joined:</span>{" "}
              {user?.joined
                ? new Date(user.joined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </p>
            <div className="flex justify-center my-5">
              <LiquidGlassButton text="Create" onClick={openCreateModal} />
              <LiquidGlassButton text="Join" onClick={openJoinModal} />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <LiquidGlassButton text="logout" onClick={handleLogout} />
        </div>
      </aside>

      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <p className="mt-8 text-gray-600 text-center">
          Create a new session or join an existing one
        </p>
      </div>
      {activeModal === "create" && (
        <CreateClass handle={closeModal} />
      )}

      {activeModal === "join" && (
        <JoinClass handle={closeModal} />
      )}
    </div>
  );
};

export default HomePage;
