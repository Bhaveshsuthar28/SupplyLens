import { useEffect } from "react";
import { LogOut, X } from "lucide-react";

export default function SignOutConfirm({ open, displayName, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: "rgba(15,23,42,0.50)", backdropFilter: "blur(6px)" }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "scaleIn 0.18s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sign out</h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Are you sure you want to sign out?
            {displayName && (
              <> You are signed in as <span className="font-medium text-gray-700">{displayName}</span>.</>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4">
          <button
            onClick={onCancel}
            className="flex-1 h-10 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
