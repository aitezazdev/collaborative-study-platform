import Modal from "react-modal";
import { FiAlertCircle, FiAlertTriangle, FiInfo, FiCheckCircle } from "react-icons/fi";

const ConfirmationModal = ({ 
  isOpen,
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  loading = false
}) => {
  const typeConfig = {
    warning: {
      icon: FiAlertTriangle,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700"
    },
    danger: {
      icon: FiAlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      buttonColor: "bg-red-600 hover:bg-red-700"
    },
    info: {
      icon: FiInfo,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    success: {
      icon: FiCheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700"
    }
  };

  const config = typeConfig[type] || typeConfig.warning;
  const Icon = config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center`}>
            <Icon className={config.iconColor} size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : config.buttonColor
            }`}>
            {loading ? "Processing..." : confirmText}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all">
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;