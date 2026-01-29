const ErrorState = ({ error, slideUrl }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        {slideUrl && (
          <a
            href={slideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Open in new tab
          </a>
        )}
      </div>
    </div>
  );
};

export default ErrorState;