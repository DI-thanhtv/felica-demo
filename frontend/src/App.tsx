import { useState } from 'react'
import { Ribbon } from './components/ribbon'
import { LeftNav } from './components/left-nav'
import { ReportEmptyCanvas } from './components/report-empty-canvas'
import { ReportBuildVisualsCanvas } from './components/report-build-visuals-canvas'
import { TableViewLayout } from './components/table-view-layout'
import { BottomBar } from './components/bottom-bar'
import { GetDataModal } from './components/get-data-modal'
import { CsvPreviewModal } from './components/csv-preview-modal'
import { LoadStatusModal } from './components/load-status-modal'
import { QueryEditorModal } from './components/query-editor-modal'
import { useAppStore } from './store/app-store'

function App() {
  const [isGetDataOpen, setIsGetDataOpen] = useState(false)
  const [csvPreview, setCsvPreview] = useState<{
    fileName: string
    headers: string[]
    rows: string[][]
  } | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [hasLoadedData, setHasLoadedData] = useState(false)
  const [currentTableName, setCurrentTableName] = useState<string | null>(null)

  const activeView = useAppStore((state) => state.activeView)
  const setActiveView = useAppStore((state) => state.setActiveView)
  const setLoadedTable = useAppStore((state) => state.setLoadedTable)
  const loadedTable = useAppStore((state) => state.loadedTable)
  const isQueryEditorOpen = useAppStore((state) => state.isQueryEditorOpen)
  const closeQueryEditor = useAppStore((state) => state.closeQueryEditor)

  const handleImportCsv = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = (event.target?.result as string) || ''
      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
      if (!lines.length) return

      const [headerLine, ...dataLines] = lines
      const headers = headerLine.split(',')
      const rows = dataLines.slice(0, 200).map((line) => line.split(','))

      setCsvPreview({
        fileName: file.name,
        headers,
        rows,
      })
      setIsGetDataOpen(false)
    }
    reader.readAsText(file)
  }

  return (
    <div className="h-full flex flex-col bg-[#f3f2f1] text-[#201f1e] relative">
      <Ribbon />

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <LeftNav activeView={activeView} onChangeView={setActiveView} />
        {activeView === 'report' ? (
          hasLoadedData ? (
            <ReportBuildVisualsCanvas />
          ) : (
            <ReportEmptyCanvas onRequestGetData={() => setIsGetDataOpen(true)} />
          )
        ) : (
          <TableViewLayout />
        )}
      </div>

      <BottomBar />

      {/* Get Data modal */}
      <GetDataModal
        isOpen={isGetDataOpen}
        onClose={() => setIsGetDataOpen(false)}
        onImportCsv={handleImportCsv}
      />

      {/* CSV preview modal */}
      <CsvPreviewModal
        isOpen={!!csvPreview}
        onClose={() => setCsvPreview(null)}
        fileName={csvPreview?.fileName ?? ''}
        headers={csvPreview?.headers ?? []}
        rows={csvPreview?.rows ?? []}
        onLoad={() => {
          if (!csvPreview) return
          const baseName = csvPreview.fileName.replace(/\.[^.]+$/, '')
          setCurrentTableName(baseName)
          setLoadedTable({
            name: baseName,
            headers: csvPreview.headers,
            rows: csvPreview.rows,
          })
          setCsvPreview(null)
          setIsLoadingData(true)
          setTimeout(() => {
            setIsLoadingData(false)
            setHasLoadedData(true)
          }, 1000)
        }}
      />

      {/* Loading modal */}
      <LoadStatusModal
        isOpen={isLoadingData}
        tableName={currentTableName ?? undefined}
        onCancel={() => setIsLoadingData(false)}
      />

      <QueryEditorModal
        isOpen={isQueryEditorOpen}
        onClose={closeQueryEditor}
        tableName={loadedTable?.name ?? ''}
        headers={loadedTable?.headers ?? []}
        rows={loadedTable?.rows ?? []}
      />

    </div>
  )
}

export default App
