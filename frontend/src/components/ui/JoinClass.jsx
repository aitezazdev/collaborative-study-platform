import { useState } from "react";
import Modal from "react-modal";
import { joinClass } from "../../api/classApi";
import { toast } from "react-toastify";

const JoinClass = ({ handle, refreshClasses }) => {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinCode = (e) => {
    setJoinCode(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!joinCode.trim()) {
        toast.error("Join Code is required");
        return;
      }
      setLoading(true);
      const response = await joinClass({ joinCode: joinCode });
      if (refreshClasses) {
        await refreshClasses();
      }
      toast.success("Class Joined Successfully");
      handle();
    } catch (error) {
      console.log("Error joining class:", error);
      toast.error(error.response?.data?.message || "Failed to join class");
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
          <h2 className="text-xl font-bold text-gray-800">Join a Class</h2>
          <p className="text-sm text-gray-500 mt-1">Enter the class code provided by your instructor</p>
        </div>

        <div className="mb-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="joinCode" className="text-sm font-medium text-gray-700">
              Class Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoComplete="off"
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all font-mono text-lg tracking-wider uppercase"
              id="joinCode"
              name="joinCode"
              required
              placeholder="ABC123"
              value={joinCode}
              onChange={handleJoinCode}
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
                : "bg-green-600 hover:bg-green-700"
            }`}>
            {loading ? "Joining..." : "Join Class"}
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className="px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default JoinClass;