import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { createClass, joinClass } from "../../api/classApi";
import { toast } from "react-toastify";

const JoinClass = ({ handle }) => {
  const [joinCode, setJoinCode] = useState("");

  const handleJoinCode = (e) => {
    setJoinCode(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!joinCode.trim()) {
        alert("Class Name is required");
        return;
      }
      await joinClass({ joinCode });
      handle();
      toast.success("Class Joined Successfully");
    } catch (error) {
      console.log(error);
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
          onChange={handleJoinCode}
        />
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
          Join
        </button>

        <button
          onClick={handle}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Close
        </button>
      </div>
    </Modal>
  );
};

export default JoinClass;
