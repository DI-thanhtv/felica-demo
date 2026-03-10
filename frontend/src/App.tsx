import { useState } from 'react'
import { Ribbon } from './components/ribbon'
import { LeftNav } from './components/left-nav'
import { ReportEmptyCanvas } from './components/report-empty-canvas'
import { BottomBar } from './components/bottom-bar'
import { GetDataModal } from './components/get-data-modal'

function App() {
  const [isGetDataOpen, setIsGetDataOpen] = useState(false)
  const [lastCsvFileName, setLastCsvFileName] = useState<string | null>(null)

  const handleImportCsv = (file: File) => {
    setLastCsvFileName(file.name)
    // chỗ này sau này có thể parse và xử lý dữ liệu CSV
  }

  return (
    <div className="h-full flex flex-col bg-[#f3f2f1] text-[#201f1e] relative">
      <Ribbon />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <LeftNav />
        <ReportEmptyCanvas onRequestGetData={() => setIsGetDataOpen(true)} />
      </div>

      <BottomBar />

      {/* Get Data modal */}
      <GetDataModal
        isOpen={isGetDataOpen}
        onClose={() => setIsGetDataOpen(false)}
        onImportCsv={handleImportCsv}
      />

      {lastCsvFileName && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded bg-black/60 text-xs text-white">
          Last CSV imported: {lastCsvFileName}
        </div>
      )}
    </div>
  )
}

export default App
