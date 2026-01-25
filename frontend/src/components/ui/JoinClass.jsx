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
      className="bg-white p-6 rounded-lg shadow-lg w-100 outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center">
      <h2 className="text-xl font-semibold mb-4">Join Class</h2>
      
      <div className="my-6 flex flex-col">
        <label htmlFor="joinCode">Class Code:</label>
        <input
          type="text"
          autoComplete="off"
          className="outline-none px-3 py-2 border border-gray-300 rounded-md mx-2"
          id="joinCode"
          name="joinCode"
          required
          placeholder="Enter Join Code"
          value={joinCode}
          onChange={handleJoinCode}
        />
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-4 px-4 py-2 text-white rounded ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-500 hover:bg-green-600"
          }`}>
          {loading ? "Joining..." : "Join"}
        </button>
        <button
          onClick={handle}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default JoinClass;