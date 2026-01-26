import { FiBook } from "react-icons/fi";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <FiBook size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes yet</h3>
      <p className="text-gray-600 mb-6 max-w-md">
        Create your first class or join an existing one to get started
      </p>
    </div>
  );
};

export default EmptyState;