import { useRef, useState } from 'react'
import { useAppStore } from '../store/app-store'

type ContextMenuState =
  | {
    x: number
    y: number
    type: 'header' | 'cell'
    columnIndex: number
    rowIndex?: number
  }
  | null

export function TableViewLayout() {
  const loadedTable = useAppStore((state) => state.loadedTable)
  const sortByColumn = useAppStore((state) => state.sortByColumn)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const headers = loadedTable?.headers ?? []
  const rows = loadedTable?.rows ?? []
  const displayName = loadedTable?.name || 'Table'

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
          className="flex-1 overflow-auto px-3 py-2 bg-white border-r border-[#e1dfdd]"
          ref={containerRef}
          onClick={() => setContextMenu(null)}
        >
          <div className="border border-[#e1dfdd]">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-[#f3f2f1]">
                <tr>
                  {headers.map((header, columnIndex) => (
                    <th
                      key={header}
                      className="px-2 py-1 border-b border-r border-[#e1dfdd] text-left font-semibold text-[#323130] whitespace-nowrap"
                      onContextMenu={(event) => {
                        if (!headers.length) return
                        event.preventDefault()
                        const rect = containerRef.current?.getBoundingClientRect()
                        const x = rect ? event.clientX - rect.left : event.clientX
                        const y = rect ? event.clientY - rect.top : event.clientY
                        setContextMenu({
                          x,
                          y,
                          type: 'header',
                          columnIndex,
                        })
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f8]'}
                  >
                    {headers.map((header, colIndex) => (
                      <td
                        key={`${rowIndex}-${header}`}
                        className="px-2 py-1 border-b border-r border-[#e1dfdd] text-[#323130] whitespace-nowrap"
                        onContextMenu={(event) => {
                          if (!headers.length) return
                          event.preventDefault()
                          const rect = containerRef.current?.getBoundingClientRect()
                          const x = rect ? event.clientX - rect.left : event.clientX
                          const y = rect ? event.clientY - rect.top : event.clientY
                          setContextMenu({
                            x,
                            y,
                            type: 'cell',
                            columnIndex: colIndex,
                            rowIndex,
                          })
                        }}
                      >
                        {row[colIndex] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
              sortByColumn(contextMenu.columnIndex, 'asc')
              setContextMenu(null)
            }}
          >
            Sort ascending
          </button>
          <button
            className="w-full text-left px-3 py-1 hover:bg-[#e5f0ff]"
            type="button"
            onClick={() => {
              sortByColumn(contextMenu.columnIndex, 'desc')
              setContextMenu(null)
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
            className="w-full text-left px-3 py-1 text-[#a19f9d]"
            type="button"
            disabled
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
  )
}

