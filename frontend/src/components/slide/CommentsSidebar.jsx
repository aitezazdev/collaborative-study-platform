import { MessageSquare, X, Send } from "lucide-react";

const CommentsSidebar = ({ currentPage, showComments, onClose }) => {
  if (!showComments) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-30 lg:hidden"
        onClick={onClose}
      />
      <div className="fixed lg:relative right-0 top-0 lg:top-auto w-96 bg-white rounded-lg shadow-xl lg:shadow-sm border border-slate-200 flex flex-col z-40 h-full lg:h-auto lg:max-h-full">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Comments</span>
            <span className="text-xs text-slate-500">(Page {currentPage})</span>
          </h3>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-slate-100 rounded transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">
              No comments yet
            </p>
            <p className="text-xs text-slate-500">
              Be the first to comment on page {currentPage}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex gap-2">
            <textarea
              placeholder={`Add a comment on page ${currentPage}...`}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows="3"></textarea>
          </div>
          <button className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2">
            <Send className="w-4 h-4" />
            <span>Post Comment</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default CommentsSidebar;