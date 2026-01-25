import { useState } from "react";
import Modal from "react-modal";
import { createClass } from "../../api/classApi";
import { toast } from "react-toastify";

const CreateClass = ({ handle, refreshClasses }) => {
  const [classData, setClassData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleClassData = (e) => {
    setClassData({ ...classData, [e.target.name]: e.target.value });
  };

  const handleClassSubmit = async () => {
    try {
      if (!classData.title.trim()) {
        toast.error("Class Name is required");
        return;
      }

      setLoading(true);
      const response = await createClass(classData);
      
      console.log("Create class response:", response);
      
      if (refreshClasses) {
        await refreshClasses();
      }
      
      toast.success("Class Created Successfully");
      handle();
      
    } catch (error) {
      console.log("Error creating class:", error);
      toast.error(error.response?.data?.message || "Failed to create class");
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
          value={classData.title}
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
          value={classData.description}
          onChange={handleClassData}
        />
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={handleClassSubmit}
          disabled={loading}
          className={`mt-4 px-4 py-2 text-white rounded ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-green-500 hover:bg-green-600"
          }`}>
          {loading ? "Creating..." : "Create"}
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

export default CreateClass;