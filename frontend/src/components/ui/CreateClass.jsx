import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { createClass } from "../../api/classApi";
import { toast } from "react-toastify";

const CreateClass = ({ isOpen, handle }) => {
  const [classData , setClassData] = useState({
    title : '',
    description : ''
  })

  const handleClassData = (e) =>{
    setClassData({...classData , [e.target.name] : e.target.value})
  }

 const handleClassSubmit = async() =>{
    try {
      if(!classData.title.trim()){
        alert("Class Name is required");
        return;
      }
      const response = await createClass(classData);
      handle();
      toast.success("Class Created Successfully");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handle}
      className="bg-white p-6 rounded-lg shadow-lg w-[400px] outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <h2 className="text-xl font-semibold mb-4">Create Your Class</h2>
      <div className="my-6 flex flex-col">
          <label htmlFor="title">Class Name:</label>
          <input
            type="text"
            autoComplete="off"
            className="outline-none px-3 py-2 border border-gray-300 rounded-md mx-2"
            id="title"
            name="title"
            required
            placeholder="Your Class Name"
            onChange={handleClassData}
          />
        </div>
        <div className="my-6 flex flex-col">
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            autoComplete="off"
            className="outline-none px-3 py-2 border border-gray-300 rounded-md mx-2"
            id="description"
            name="description"
            placeholder="Your Class Description (optional)"
            onChange={handleClassData}
          />
        </div>

      <div className="flex justify-center gap-2">
        <button
        onClick={handleClassSubmit}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Create
      </button>

      <button
        onClick={handle}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Close
      </button>
      </div>
    </Modal>
  );
};

export default CreateClass;
