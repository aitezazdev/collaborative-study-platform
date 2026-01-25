import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LiquidGlassButton from "../components/LiquadButton";
import CreateClass from "../components/ui/CreateClass";
import JoinClass from "../components/ui/JoinClass";
import EditProfileModal from "../components/ui/EditProfileModal";
import { fetchUserProfile } from "../api/userProfile";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  useEffect(() => {
    const getUser = async () => {
      const res = await fetchUserProfile();
      if (res.success) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    };
    getUser();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-col items-center text-center mb-8 pb-6 border-b border-slate-200">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full mb-3 flex items-center justify-center text-white text-2xl font-bold overflow-hidden bg-blue-500">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "A"
              )}
            </div>

            {/* Name */}
            <h2 className="text-xl font-semibold text-slate-900">
              {user?.name || "Anonymous"}
            </h2>

            {/* Email */}
            <p className="text-sm text-slate-600 mt-1">
              {user?.email || "No email provided"}
            </p>

            {/* Bio */}
            {user?.bio && (
              <p className="text-xs text-slate-500 mt-1 italic">{user.bio}</p>
            )}

            {/* Joined Date */}
            {user?.createdAt && !isNaN(new Date(user.createdAt)) && (
              <p className="text-xs text-slate-500 mt-2">
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}

            {/* Edit Profile */}
            <button
              onClick={() => {
                setModalType("editProfile");
                setIsModalOpen(true);
              }}
              className="mt-3 text-sm text-blue-600 underline">
              Edit Profile
            </button>
          </div>

          <div className="space-y-3">
            <LiquidGlassButton
              text="Create Class"
              onClick={() => {
                setModalType("create");
                setIsModalOpen(true);
              }}
            />
            <LiquidGlassButton
              text="Join Class"
              onClick={() => {
                setModalType("join");
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <LiquidGlassButton text="Logout" onClick={handleLogout} />
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>

      {isModalOpen && modalType === "create" && (
        <CreateClass handle={() => setIsModalOpen(false)} />
      )}
      {isModalOpen && modalType === "join" && (
        <JoinClass handle={() => setIsModalOpen(false)} />
      )}
      {isModalOpen && modalType === "editProfile" && (
        <EditProfileModal
          handle={() => setIsModalOpen(false)}
          user={user}
          setUser={setUser}
        />
      )}
    </div>
  );
};

export default AppLayout;
