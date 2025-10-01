import React from "react";

const Card = ({ message, showEdit = true, onEdit }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("sv-SE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">
      {/* User info och datum */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-red-500 rounded-sm flex items-center justify-center">
          <span className="text-white font-bold text-xs">
            {(message.username || message.userName || "U") // Faller tillbaka till unknown "U" om inget användarnamn finns.
              .charAt(0)
              .toUpperCase()}
          </span>
        </div>
        <span className="text-gray-300 text-sm">
          {formatDate(message.createdAt)}
        </span>
      </div>

      <div className="relative">
        <div className="bg-white rounded-lg shadow-lg p-4 relative max-w-md">
          <p className="text-gray-900 leading-relaxed text-sm mb-3">
            {message.text || message.message || "No content"}
          </p>

          <div className="pt-2 border-t border-gray-200">
            <span className="text-gray-800 font-semibold text-sm">
              — {message.username || message.userName || "Unknown"}
            </span>
          </div>

          <div className="absolute -left-2 top-4 w-4 h-4 bg-white transform rotate-45 shadow-lg"></div>

          {showEdit && onEdit && (
            <button
              onClick={() => onEdit(message)}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-sm flex items-center justify-center shadow-lg transition-colors"
              title="Redigera meddelande"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
