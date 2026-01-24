import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import LiquidGlassButton from "../components/LiquadButton";
import { toast } from "react-toastify";

const AppLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const reduxUser = useSelector((state) => state.auth.user);
    const localUser = JSON.parse(localStorage.getItem("user"));
    const user = reduxUser || localUser;

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
                        <div className="w-20 h-20 bg-blue-500 rounded-full mb-3 flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                        <h2 className="text-xl font-semibold text-slate-900">
                            {user?.name}
                        </h2>

                        <p className="text-sm text-slate-600 mt-1">
                            {user?.email}
                        </p>

                        {user?.joined && !isNaN(new Date(user.joined)) && (
                            <p className="text-xs text-slate-500 mt-2">
                                Joined {new Date(user.joined).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        )}

                    </div>

                    <div className="space-y-3">
                        <LiquidGlassButton text="Create Class" />
                        <LiquidGlassButton text="Join Class" />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                    <LiquidGlassButton text="Logout" onClick={handleLogout} />
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
