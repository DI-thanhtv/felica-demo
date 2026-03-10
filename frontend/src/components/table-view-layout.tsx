import { useEffect, useMemo, useRef, useState } from "react";
import { List, type RowComponentProps } from "react-window";
import { useAppStore } from "../store/app-store";

type ContextMenuState = {
  x: number;
  y: number;
  type: "header" | "cell";
  columnIndex: number;
  rowIndex?: number;
} | null;

export function TableViewLayout() {
  const loadedTable = useAppStore((state) => state.loadedTable);
  const sortByColumn = useAppStore((state) => state.sortByColumn);
  const openQueryEditor = useAppStore((state) => state.openQueryEditor);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const headers = loadedTable?.headers ?? [];
  const rows = loadedTable?.rows ?? [];
  const displayName = loadedTable?.name || "Table";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const ROW_HEIGHT = 28;
  const HEADER_HEIGHT = 36;

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
    const row = rows[index];
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
              if (!headers.length) return;
              event.preventDefault();
              const rect = containerRef.current?.getBoundingClientRect();
              const x = rect ? event.clientX - rect.left : event.clientX;
              const y = rect ? event.clientY - rect.top : event.clientY;
              setContextMenu({
                x,
                y,
                type: "cell",
                columnIndex: colIndex,
                rowIndex: index,
              });
            }}
          >
            {row?.[colIndex] ?? ""}
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden relative">
      {/* Table tools header row (simple version) */}
      <div className="h-10 border-b border-[#e1dfdd] bg-white flex items-center px-4 text-sm">
        <span className="font-semibold mr-4">Table tools</span>
        <div className="flex items-center gap-2 text-xs text-[#605e5c]">
          <span>Name</span>
          <input
            className="h-7 border border-[#a19f9d] rounded px-2 text-xs"
            value={displayName}
            readOnly
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main table area */}
        <div
          className="flex-1 bg-white border-r border-[#e1dfdd]"
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
                    const rect = containerRef.current?.getBoundingClientRect();
                    const x = rect ? event.clientX - rect.left : event.clientX;
                    const y = rect ? event.clientY - rect.top : event.clientY;
                    setContextMenu({
                      x,
                      y,
                      type: "header",
                      columnIndex: headers.indexOf(header),
                    });
                  }}
                >
                  {header}
                </div>
              ))}
            </div>

            <div className="overflow-auto" style={{ minWidth: minTableWidth }}>
              <List
                defaultHeight={listHeight}
                rowCount={rows.length}
                rowHeight={ROW_HEIGHT}
                rowComponent={Row}
                rowProps={{}}
                style={{ width: "100%", height: listHeight }}
              />
            </div>
          </div>
        </div>

        {/* Right data pane */}
        <aside className="w-52 border-l border-[#e1dfdd] bg-[#f3f2f1] flex flex-col">
          <div className="h-9 flex items-center justify-between px-3 border-b border-[#e1dfdd] text-xs text-[#323130]">
            <span>Data</span>
          </div>
          <div className="flex-1 overflow-auto px-2 py-2 text-xs">
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#e1dfdd] cursor-default">
              <span className="truncate">{displayName}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="absolute z-50 bg-white border border-[#e1dfdd] rounded shadow-md text-xs text-[#323130] w-[180px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            className="w-full text-left px-3 py-1 hover:bg-[#e5f0ff]"
            type="button"
            onClick={() => {
              sortByColumn(contextMenu.columnIndex, "asc");
              setContextMenu(null);
            }}
          >
            Sort ascending
          </button>
          <button
            className="w-full text-left px-3 py-1 hover:bg-[#e5f0ff]"
            type="button"
            onClick={() => {
              sortByColumn(contextMenu.columnIndex, "desc");
              setContextMenu(null);
            }}
          >
            Sort descending
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            Clear sort
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            Clear filter
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            Clear all filters
          </button>
          <div className="h-px bg-[#e1dfdd] my-1" />
          <button
            className="w-full text-left px-3 py-1 hover:bg-[#e5f0ff]"
            type="button"
          >
            Copy
          </button>
          <div className="h-px bg-[#e1dfdd] my-1" />
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            New measure
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            New column
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            Refresh data
          </button>
          <button
            className="w-full text-left px-3 py-1 hover:bg-[#e5f0ff]"
            type="button"
            onClick={() => {
              openQueryEditor();
              setContextMenu(null);
            }}
          >
            Edit query
          </button>
          <div className="h-px bg-[#e1dfdd] my-1" />
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            Rename
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            Delete
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            Hide in report view
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            Unhide all
          </button>
          <button
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
          >
            New group
          </button>
        </div>
      )}
    </main>
  );
}
