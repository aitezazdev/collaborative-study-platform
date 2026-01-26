import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { fetchUserProfile } from "../api/userProfile";
import CreateClass from "../components/ui/CreateClass";
import JoinClass from "../components/ui/JoinClass";
import EditProfileModal from "../components/ui/EditProfileModal";
import { 
  FiHome, 
  FiLogOut,
  FiPlus, 
  FiUserPlus,
  FiBookOpen,
  FiCalendar,
  FiSettings,
  FiChevronRight
} from "react-icons/fi";

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
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

  const handleClassUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden bg-linear-to-br from-blue-500 to-purple-600 ring-4 ring-blue-50">
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
                <button
                  onClick={() => {
                    setModalType("editProfile");
                    setIsModalOpen(true);
                  }}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <FiSettings size={14} />
                </button>
              </div>

              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                {user?.name || "Anonymous"}
              </h2>

              <p className="text-sm text-slate-600 mb-3">
                {user?.email || "No email provided"}
              </p>

              {user?.bio && (
                <p className="text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg mb-3 italic border border-slate-200">
                  {user.bio}
                </p>
              )}

              {user?.createdAt && !isNaN(new Date(user.createdAt)) && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FiCalendar size={12} />
                  <span>
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2 px-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Navigation
              </span>
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => navigate("/")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActivePath("/")
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FiHome size={18} />
                <span>My Classes</span>
                {isActivePath("/") && (
                  <FiChevronRight size={16} className="ml-auto" />
                )}
              </button>
            </nav>
          </div>

          <div className="p-4">
            <div className="mb-2 px-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Quick Actions
              </span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setModalType("create");
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
              >
                <FiPlus size={18} />
                <span className="font-medium">Create Class</span>
              </button>
              <button
                onClick={() => {
                  setModalType("join");
                  setIsModalOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300"
              >
                <FiUserPlus size={18} />
                <span className="font-medium">Join Class</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <FiLogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet context={{ refreshTrigger }} />
      </main>

      {isModalOpen && modalType === "create" && (
        <CreateClass
          handle={() => setIsModalOpen(false)}
          refreshClasses={handleClassUpdate}
        />
      )}
      {isModalOpen && modalType === "join" && (
        <JoinClass
          handle={() => setIsModalOpen(false)}
          refreshClasses={handleClassUpdate}
        />
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