export function ReportBuildVisualsCanvas() {
  return (
    <main className="flex-1 flex flex-col overflow-hidden px-4 pt-3 pb-2">
      <div className="flex-1 bg-white border border-dashed border-[#a19f9d] rounded-sm flex flex-col items-center justify-center">
        <div className="text-center max-w-xl">
          <h1 className="text-xl font-semibold mb-1 text-[#201f1e]">
            Build visuals with your data
          </h1>
          <p className="text-sm text-[#605e5c] mb-4">
            Select or drag fields from the Data pane onto the report canvas.
          </p>
          <div className="inline-flex flex-col items-center justify-center border-2 border-dashed border-[#0078d4] rounded-md px-6 py-4">
            <div className="h-12 w-20 bg-[#e8f3fb] border border-[#a19f9d] rounded mb-3" />
            <div className="h-8 w-28 bg-white border border-[#a19f9d] rounded" />
          </div>
        </div>
      </div>
    </main>
  )
}

