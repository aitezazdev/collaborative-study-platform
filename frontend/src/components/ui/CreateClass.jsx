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
      className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-800">Create Your Class</h2>
          <p className="text-sm text-gray-500 mt-1">Set up a new class for your students</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoComplete="off"
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              id="title"
              name="title"
              required
              placeholder="e.g., Advanced Mathematics"
              value={classData.title}
              onChange={handleClassData}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              autoComplete="off"
              className="outline-none px-3 py-2.5 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all min-h-20 resize-none"
              id="description"
              name="description"
              placeholder="Optional class description"
              value={classData.description}
              onChange={handleClassData}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleClassSubmit}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}>
            {loading ? "Creating..." : "Create Class"}
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

export default CreateClass;