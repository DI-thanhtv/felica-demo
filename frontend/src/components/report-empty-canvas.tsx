type ReportEmptyCanvasProps = {
  onRequestGetData: () => void
}

export function ReportEmptyCanvas({ onRequestGetData }: ReportEmptyCanvasProps) {
  return (
    <main className="flex-1 flex flex-col overflow-hidden px-4 pt-3 pb-2">
      <div className="flex-1 bg-white border border-dashed border-[#a19f9d] rounded-sm flex flex-col items-center justify-center">
        <div className="text-center max-w-xl">
          <h1 className="text-xl font-semibold mb-1 text-[#201f1e]">
            Add data to your report
          </h1>
          <p className="text-sm text-[#605e5c] mb6">
            Once loaded, your data will appear in the{' '}
            <span className="font-semibold">Data</span> pane.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <div className="w-44 h-28 bg-[#dff6dd] border border-[#e1dfdd] rounded shadow-sm flex flex-col justify-end">
              <div className="h-10 w-10 bg-[#107c10] rounded-md ml-4 mb-4" />
              <div className="bg-white px-3 py-2 border-t border-[#e1dfdd] text-xs text-[#323130]">
                Import data from Excel
              </div>
            </div>
            <div className="w-44 h-28 bg-[#e8f3fb] border border-[#e1dfdd] rounded shadow-sm flex flex-col justify-end">
              <div className="h-10 w-10 bg-[#0078d4] rounded-full ml-4 mb-4" />
              <div className="bg-white px-3 py-2 border-t border-[#e1dfdd] text-xs text-[#323130]">
                Import data from SQL Server
              </div>
            </div>
            <div className="w-44 h-28 bg-[#fff4ce] border border-[#e1dfdd] rounded shadow-sm flex flex-col justify-end">
              <div className="h-10 w-8 bg-[#fce100] rounded ml-4 mb-4" />
              <div className="bg-white px-3 py-2 border-t border-[#e1dfdd] text-xs text-[#323130]">
                Paste data into a blank table
              </div>
            </div>
            <div className="w-44 h-28 bg-[#f3f2f1] border border-[#e1dfdd] rounded shadow-sm flex flex-col justify-end">
              <div className="h-10 w-10 border border-[#a19f9d] rounded-md ml-4 mb-4" />
              <div className="bg-white px-3 py-2 border-t border-[#e1dfdd] text-xs text-[#323130]">
                Use sample data
              </div>
            </div>
          </div>

          <button
            className="mt-6 text-sm text-[#0078d4] hover:underline"
            onClick={onRequestGetData}
          >
            Get data from another source →
          </button>
        </div>
      </div>
    </main>
  )
}

