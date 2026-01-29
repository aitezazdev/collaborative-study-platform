import { ClipLoader } from "react-spinners";

const LoadingState = ({ pdfJsReady }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <ClipLoader color="#3B82F6" size={50} />
        <p className="text-gray-600">Loading slide...</p>
        {!pdfJsReady && (
          <p className="text-gray-500 text-sm">
            Initializing PDF viewer...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingState;