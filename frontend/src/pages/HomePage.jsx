import React, { useEffect, useState } from "react";
import LiquidGlassButton from "../components/LiquadButton";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreateClass from "../components/ui/CreateClass";
import JoinClass from "../components/ui/JoinClass";
import { fetchUserClasses } from "../api/classApi";
import { FiCopy } from "react-icons/fi";

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState([]);
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
  const copyCode = (e) => {
    const code = e.currentTarget.parentElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
      toast.success("Join code copied to clipboard!");
    });
  }

  const handleClassModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  }

  useEffect(() => {
    const getUserClasses = async () => {
      try {
        const data = await fetchUserClasses();
        setClasses(data.data);
        console.log("Fetched classes:", data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    getUserClasses();
  }, []);


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

      <div className="flex-1 p-8 flex ">
        {classes && Array.isArray(classes) && classes.length === 0 ? (
          <h2 className="text-2xl font-semibold text-gray-700">No classes joined yet.</h2>
        ) : (
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-700">My Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(classes) && classes.map((cls) => (
                <div key={cls._id} className="bg-white p-4 rounded-lg shadow-2xl ">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{cls?.title}</h3>
                  <h2 className="text-xl  mb-2 text-gray-800">{cls?.description}</h2>

                  <h2 className="text-xl mb-2 text-gray-800 flex items-center gap-2">
                    <span>{cls?.joinCode}</span>

                    <button
                      onClick={copyCode}
                      className="text-gray-500 hover:text-gray-800 transition cursor-pointer"
                      title="Copy"
                    >
                      <FiCopy size={18}  />
                    </button>
                  </h2>
                </div>
              ))}
            </div>
          </div>
        )}

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
