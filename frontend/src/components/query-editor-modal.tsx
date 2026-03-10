import { useEffect, useMemo, useRef, useState } from "react";
import { List, type RowComponentProps } from "react-window";

type QueryEditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
  headers: string[];
  rows: string[][];
};

export function QueryEditorModal({
  isOpen,
  onClose,
  tableName,
  headers,
  rows,
}: QueryEditorModalProps) {
  if (!isOpen) return null;

  const displayName = tableName || "Table";
  const [editorRows, setEditorRows] = useState(rows);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    clientX: number;
    clientY: number;
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const [replaceDialog, setReplaceDialog] = useState<{
    isOpen: boolean;
    columnIndex: number;
    initialValue: string;
  } | null>(null);
  const [replaceFrom, setReplaceFrom] = useState("");
  const [replaceTo, setReplaceTo] = useState("");

  const ROW_HEIGHT = 28;
  const HEADER_HEIGHT = 42;
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      setContainerHeight(el.clientHeight);
    });
    resizeObserver.observe(el);
    setContainerHeight(el.clientHeight);

    return () => resizeObserver.disconnect();
  }, []);

  const listHeight = Math.max(0, containerHeight - HEADER_HEIGHT);

  const minTableWidth = useMemo(() => {
    const minColWidth = 140;
    return Math.max(headers.length * minColWidth, 600);
  }, [headers.length]);

  const Row = ({ index, style, ariaAttributes }: RowComponentProps) => {
    const row = editorRows[index];
    const rowClass = index % 2 === 0 ? "bg-white" : "bg-[#f9f9f8]";

    return (
      <div
        {...ariaAttributes}
        style={style}
        className={`${rowClass} flex items-center`}
        onClick={() => setContextMenu(null)}
      >
        <div className="px-2 py-1 text-[#605e5c]" style={{ minWidth: 48 }}>
          {index + 1}
        </div>
        {headers.map((header, colIndex) => (
          <div
            key={`${index}-${header}`}
            className="px-2 py-1 border-l border-[#e1dfdd] text-[#323130] whitespace-nowrap"
            style={{ minWidth: 140 }}
            onContextMenu={(event) => {
              event.preventDefault();
              setContextMenu({
                clientX: event.clientX,
                clientY: event.clientY,
                rowIndex: index,
                colIndex,
              });
            }}
          >
            {row?.[colIndex] ?? ""}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    setEditorRows(rows);
  }, [rows]);

  const handleCopyCell = (rowIndex: number, colIndex: number) => {
    const value = editorRows[rowIndex]?.[colIndex] ?? "";
    if (!value) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
  };

  const handleDrillDown = (rowIndex: number) => {
    const row = editorRows[rowIndex];
    if (!row) return;
    setEditorRows([row]);
  };

  const handleOpenReplace = (rowIndex: number, colIndex: number) => {
    const currentValue = editorRows[rowIndex]?.[colIndex] ?? "";
    setReplaceFrom(currentValue);
    setReplaceTo("");
    setReplaceDialog({
      isOpen: true,
      columnIndex: colIndex,
      initialValue: currentValue,
    });
  };

  const handleApplyReplace = () => {
    if (!replaceDialog) return;
    const { columnIndex } = replaceDialog;
    const from = replaceFrom;
    const to = replaceTo;
    setEditorRows((prev) =>
      prev.map((row) => {
        const copy = [...row];
        if (copy[columnIndex] === from) {
          copy[columnIndex] = to;
        }
        return copy;
      }),
    );
    setReplaceDialog(null);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
      <div className="w-[90vw] max-h-[90vh] bg-white border border-[#e1dfdd] rounded shadow-lg flex flex-col">
        {/* Ribbon area */}
        <header className="border-b border-[#e1dfdd] bg-white">
          <div className="flex items-center h-8 px-3 gap-2 text-sm">
            <span className="mr-4 text-sm text-[#323130] cursor-pointer">
              File
            </span>
            <button className="px-3 text-sm border-b-2 border-[#107c10] font-semibold text-[#107c10] h-full">
              Home
            </button>
            <button className="px-3 text-sm text-[#323130] h-full">
              Transform
            </button>
            <button className="px-3 text-sm text-[#323130] h-full">
              Add column
            </button>
            <button className="px-3 text-sm text-[#323130] h-full">View</button>
            <button className="px-3 text-sm text-[#323130] h-full">
              Tools
            </button>
            <button className="px-3 text-sm text-[#323130] h-full">Help</button>
            <button
              className="ml-auto h-7 w-7 flex items-center justify-center rounded hover:bg-[#e1dfdd] text-[#605e5c]"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          {/* Simplified command ribbon */}
          <div className="h-16 border-t border-[#e1dfdd] bg-[#f3f2f1] flex items-center px-3 text-xs text-[#323130]">
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="font-semibold mb-1">Close &amp; Apply</span>
                <span>Apply changes and close</span>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Queries pane */}
          <aside className="w-48 border-r border-[#e1dfdd] bg-[#f3f2f1] flex flex-col">
            <div className="h-8 flex items-center px-3 border-b border-[#e1dfdd] text-xs text-[#323130]">
              Queries [1]
            </div>
            <div className="flex-1 overflow-auto px-2 py-2 text-xs">
              <div className="px-2 py-1 rounded bg-white border border-[#e1dfdd]">
                {displayName}
              </div>
            </div>
          </aside>

          {/* Center table area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Formula bar mock */}
            <div className="h-9 border-b border-[#e1dfdd] flex items-center px-3 text-xs text-[#323130]">
              <span className="mr-2">fx</span>
              <div className="flex-1 h-6 border border-[#e1dfdd] rounded bg-[#faf9f8]" />
            </div>

            {/* Table preview */}
            <div
              className="flex-1 overflow-auto px-3 py-2"
              ref={containerRef}
              onClick={() => setContextMenu(null)}
            >
              <div className="border border-[#e1dfdd]">
                <div className="flex bg-[#f3f2f1] border-b border-[#e1dfdd]">
                  <div
                    className="px-2 py-1 text-left text-[#605e5c]"
                    style={{ minWidth: 48 }}
                  >
                    #
                  </div>
                  {headers.map((header) => (
                    <div
                      key={header}
                      className="px-2 py-1 text-left font-semibold text-[#323130] whitespace-nowrap"
                      style={{ minWidth: 140 }}
                      onContextMenu={(event) => {
                        if (!headers.length) return;
                        event.preventDefault();
                        setContextMenu({
                          clientX: event.clientX,
                          clientY: event.clientY,
                          rowIndex: 0,
                          colIndex: headers.indexOf(header),
                        });
                      }}
                    >
                      {header}
                    </div>
                  ))}
                </div>
                <div
                  className="overflow-auto"
                  style={{ minWidth: minTableWidth }}
                >
                  <List
                    defaultHeight={listHeight}
                    rowCount={editorRows.length}
                    rowHeight={ROW_HEIGHT}
                    rowComponent={Row}
                    rowProps={{}}
                    style={{ width: "100%", height: listHeight }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Query Settings pane */}
          <aside className="w-64 border-l border-[#e1dfdd] bg-[#f3f2f1] flex flex-col">
            <div className="h-8 flex items-center px-3 border-b border-[#e1dfdd] text-xs text-[#323130]">
              Query Settings
            </div>
            <div className="flex-1 overflow-auto px-3 py-2 text-xs text-[#323130] space-y-3">
              <div>
                <div className="font-semibold mb-1">PROPERTIES</div>
                <label className="block mb-1">Name</label>
                <input
                  className="w-full h-7 border border-[#a19f9d] rounded px-2 text-xs bg-white"
                  value={displayName}
                  readOnly
                />
              </div>
              <div>
                <div className="font-semibold mb-1">APPLIED STEPS</div>
                <ul className="border border-[#e1dfdd] bg-white rounded divide-y divide-[#e1dfdd]">
                  <li className="px-2 py-1">Source</li>
                  <li className="px-2 py-1">Promoted Headers</li>
                  <li className="px-2 py-1">Changed Type</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        {/* Cell context menu - fixed so it appears at cursor */}
        {contextMenu && (
          <div
            className="fixed z-[100] bg-white border border-[#e1dfdd] rounded shadow-md text-xs text-[#323130] w-[160px]"
            style={{
              top: contextMenu.clientY,
              left: contextMenu.clientX,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="w-full text-left px-3 py-1 hover:bg-[#e5f0ff]"
              type="button"
              onClick={() => {
                handleCopyCell(contextMenu.rowIndex, contextMenu.colIndex);
                setContextMenu(null);
              }}
            >
              Copy
            </button>
            <button
              className="w-full text-left px-3 py-1 text-[#a19f9d]"
              type="button"
              disabled
            >
              Text Filters &gt;
            </button>
            <button
              className="w-full text-left px-3 py-1 hover:bg-[#e5f0ff]"
              type="button"
              onClick={() => {
                handleOpenReplace(contextMenu.rowIndex, contextMenu.colIndex);
                setContextMenu(null);
              }}
            >
              Replace Values...
            </button>
            <button
              className="w-full text-left px-3 py-1 hover:bg-[#e5f0ff]"
              type="button"
              onClick={() => {
                handleDrillDown(contextMenu.rowIndex);
                setContextMenu(null);
              }}
            >
              Drill Down
            </button>
            <button
              className="w-full text-left px-3 py-1 text-[#a19f9d]"
              type="button"
              disabled
            >
              Add as New Query
            </button>
          </div>
        )}

        {/* Replace Values dialog */}
        {replaceDialog?.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-50">
            <div className="w-[360px] bg-white border border-[#e1dfdd] rounded shadow-lg p-4 text-xs text-[#323130]">
              <div className="font-semibold mb-3">Replace Values</div>
              <div className="mb-3">
                <label className="block mb-1">Value to find</label>
                <input
                  className="w-full h-7 border border-[#a19f9d] rounded px-2 text-xs"
                  value={replaceFrom}
                  onChange={(e) => setReplaceFrom(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Replace with</label>
                <input
                  className="w-full h-7 border border-[#a19f9d] rounded px-2 text-xs"
                  value={replaceTo}
                  onChange={(e) => setReplaceTo(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 text-xs rounded border border-[#8a8886] bg-white text-[#323130]"
                  type="button"
                  onClick={() => setReplaceDialog(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-3 py-1 text-xs rounded bg-[#107c10] text-white font-semibold"
                  type="button"
                  onClick={handleApplyReplace}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
