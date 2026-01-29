import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "../../redux/slices/authSlice";
import { updateUserProfile } from "../../api/userProfile";

const EditProfileModal = ({ handle, user, onUserUpdate }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        avatar: files[0],
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("bio", formData.bio);
      if (formData.avatar) {
        data.append("avatar", formData.avatar);
        console.log("📎 Avatar file attached:", formData.avatar.name);
      }
      
      console.log("📤 Sending profile update...");
      const res = await updateUserProfile(data);
      console.log("✅ Profile update response:", res);
      
      if (res.success && res.data) {
        if (onUserUpdate) {
          onUserUpdate(res.data);
        }
        
        const token = localStorage.getItem("token");
        dispatch(setReduxUser({ user: res.data, token }));
        toast.success("Profile updated successfully");
        handle();
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={handle}
      className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to change avatar</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className="px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;