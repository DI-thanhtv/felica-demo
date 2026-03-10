import { useState } from "react";

type SqlQueryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRun: (query: string) => void;
  initialValue?: string;
  error?: string;
};

export function SqlQueryModal({
  isOpen,
  onClose,
  onRun,
  initialValue = "",
  error,
}: SqlQueryModalProps) {
  if (!isOpen) return null;

  const [query, setQuery] = useState(initialValue);

  const handleRun = () => {
    onRun(query.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-40">
      <div className="w-[700px] max-w-[95vw] max-h-[85vh] bg-white border border-[#e1dfdd] rounded shadow-lg flex flex-col">
        <div className="h-10 px-4 flex items-center justify-between border-b border-[#e1dfdd] bg-[#f3f2f1]">
          <span className="text-sm font-semibold text-[#201f1e]">
            SQL query
          </span>
          <button
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-[#e1dfdd] text-[#605e5c]"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto px-4 py-4">
          <textarea
            className="w-full h-full min-h-[220px] resize-none border border-[#a19f9d] rounded p-2 text-xs font-mono text-[#201f1e]"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="SELECT * FROM ? WHERE ..."
          />
          {error ? (
            <div className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="h-11 px-4 pb-2 flex items-center justify-end gap-2">
          <button
            className="px-4 py-1 text-xs rounded border border-[#8a8886] text-[#323130] bg-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1 text-xs rounded bg-[#107c10] text-white font-semibold"
            onClick={handleRun}
          >
            Run
          </button>
        </div>
      </div>
    </div>
  );
}
