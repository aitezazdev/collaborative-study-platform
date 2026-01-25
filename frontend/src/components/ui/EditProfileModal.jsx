import React, { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../api/userProfile";

const EditProfileModal = ({ handle, user, setUser }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("bio", formData.bio);
      if (formData.avatar) data.append("avatar", formData.avatar);

      const res = await updateUserProfile(data);
      if (res.success) {
        toast.success("Profile updated successfully");

        setUser(res.data);

        localStorage.setItem("user", JSON.stringify(res.data));

        handle();
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={handle}
      className="bg-white p-6 rounded-lg shadow-lg w-100 max-w-md mx-auto outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="outline-none px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="outline-none px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="outline-none px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label>Avatar</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded">
          Save
        </button>
        <button
          onClick={handle}
          className="px-4 py-2 bg-red-500 text-white rounded">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
