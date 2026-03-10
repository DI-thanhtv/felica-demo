type LoadStatusModalProps = {
  isOpen: boolean
  tableName?: string
  onCancel: () => void
}

export function LoadStatusModal({ isOpen, tableName, onCancel }: LoadStatusModalProps) {
  if (!isOpen) return null

  const displayName = tableName || 'Table'

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-40">
      <div className="w-[420px] max-w-[90vw] bg-white border border-[#e1dfdd] rounded shadow-lg flex flex-col">
        <div className="h-10 px-4 flex items-center justify-between border-b border-[#e1dfdd] bg-[#f3f2f1]">
          <span className="text-sm font-semibold text-[#201f1e]">Load</span>
          <button
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-[#e1dfdd] text-[#605e5c]"
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        <div className="px-4 py-6 text-sm text-[#323130]">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-3 w-3 rounded-full border-2 border-[#107c10] border-t-transparent animate-spin" />
            <div>
              <div className="font-semibold">{displayName}</div>
              <div className="text-xs text-[#605e5c] mt-1">Syncing schema...</div>
            </div>
          </div>
        </div>

        <div className="h-11 px-4 pb-3 flex items-center justify-end">
          <button
            className="px-4 py-1 text-xs rounded border border-[#8a8886] text-[#323130] bg-white"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

