type CsvPreviewModalProps = {
  isOpen: boolean
  onClose: () => void
  fileName: string
  headers: string[]
  rows: string[][]
  onLoad: () => void
}

export function CsvPreviewModal({
  isOpen,
  onClose,
  fileName,
  headers,
  rows,
  onLoad,
}: CsvPreviewModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-30">
      <div className="w-[900px] max-w-[95vw] max-h-[85vh] bg-white border border-[#e1dfdd] rounded shadow-lg flex flex-col">
        {/* Title bar */}
        <div className="h-10 px-4 flex items-center justify-between border-b border-[#e1dfdd] bg-[#f3f2f1]">
          <span className="text-sm font-semibold text-[#201f1e]">
            {fileName || 'CSV preview'}
          </span>
          <button
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-[#e1dfdd] text-[#605e5c]"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Controls row */}
        <div className="px-4 py-2 flex gap-4 text-xs border-b border-[#e1dfdd]">
          <div className="flex flex-col gap-1">
            <span className="text-[#605e5c]">File Origin</span>
            <select className="h-7 border border-[#a19f9d] rounded px-2 text-xs bg-white">
              <option>1252: Western European (Windows)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#605e5c]">Delimiter</span>
            <select className="h-7 border border-[#a19f9d] rounded px-2 text-xs bg-white">
              <option>Comma</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#605e5c]">Data Type Detection</span>
            <select className="h-7 border border-[#a19f9d] rounded px-2 text-xs bg-white">
              <option>Based on first 200 rows</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-4 py-3">
          <div className="border border-[#e1dfdd]">
            <table className="min-w-full border-collapse text-xs">
              <thead className="bg-[#f3f2f1]">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-2 py-1 border-b border-r border-[#e1dfdd] text-left font-semibold text-[#323130] whitespace-nowrap"
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

        {/* Footer buttons */}
        <div className="h-11 px-4 pb-2 flex items-center justify-between">
          <button className="px-3 py-1 text-xs text-[#0078d4] hover:underline">
            Extract Table Using Examples
          </button>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-1 text-xs rounded bg-[#107c10] text-white font-semibold"
              type="button"
              onClick={onLoad}
            >
              Load
            </button>
            <button className="px-4 py-1 text-xs rounded border border-[#8a8886] text-[#323130] bg-white">
              Transform Data
            </button>
            <button
              className="px-4 py-1 text-xs rounded border border-[#8a8886] text-[#323130] bg-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

