import { useState, useRef } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { HiOutlineSearch } from 'react-icons/hi'
import { BsFileEarmark, BsGrid } from 'react-icons/bs'
import { FiCloud, FiDatabase, FiGlobe } from 'react-icons/fi'

type GetDataModalProps = {
  isOpen: boolean
  onClose: () => void
  onImportCsv: (file: File) => void
}

type Connector = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isEnabled?: boolean
}

const CONNECTORS: Connector[] = [
  { id: 'excel', label: 'Excel Workbook', icon: BsFileEarmark },
  { id: 'text_csv', label: 'Text/CSV', icon: BsFileEarmark, isEnabled: true },
  { id: 'xml', label: 'XML', icon: BsFileEarmark },
  { id: 'json', label: 'JSON', icon: BsFileEarmark },
  { id: 'folder', label: 'Folder', icon: BsGrid },
  { id: 'pdf', label: 'PDF', icon: BsFileEarmark },
  { id: 'parquet', label: 'Parquet', icon: BsFileEarmark },
  { id: 'sharepoint', label: 'SharePoint folder', icon: FiCloud },
  { id: 'sql_server', label: 'SQL Server database', icon: FiDatabase },
  { id: 'access', label: 'Access database', icon: FiDatabase },
  {
    id: 'ssas',
    label: 'SQL Server Analysis Services database',
    icon: FiDatabase,
  },
  { id: 'oracle', label: 'Oracle database', icon: FiDatabase },
  { id: 'db2', label: 'IBM Db2 database', icon: FiDatabase },
  { id: 'informix', label: 'IBM Informix database (Beta)', icon: FiDatabase },
  { id: 'netezza', label: 'IBM Netezza', icon: FiDatabase },
  { id: 'mysql', label: 'MySQL database', icon: FiDatabase },
  { id: 'web', label: 'Web', icon: FiGlobe },
]

const CATEGORIES = [
  'All',
  'File',
  'Database',
  'Microsoft Fabric',
  'Power Platform',
  'Azure',
  'Online Services',
  'Other',
]

export function GetDataModal({
  isOpen,
  onClose,
  onImportCsv,
}: GetDataModalProps) {
  const [activeConnectorId, setActiveConnectorId] = useState<string>('excel')
  const [activeCategory] = useState<string>('All')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (!isOpen) return null

  const handleClickConnector = (connector: Connector) => {
    setActiveConnectorId(connector.id)

    if (connector.id === 'text_csv' && connector.isEnabled) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    onImportCsv(file)
  }

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-20">
      <div className="w-[720px] max-w-[90vw] max-h-[80vh] bg-white border border-[#e1dfdd] rounded shadow-lg flex flex-col">
        {/* Title bar */}
        <div className="h-10 px-4 flex items-center justify-between border-b border-[#e1dfdd] bg-[#f3f2f1]">
          <span className="text-sm font-semibold text-[#201f1e]">Get Data</span>
          <button
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-[#e1dfdd] text-[#605e5c]"
            onClick={onClose}
          >
            <MdOutlineClose />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: categories */}
          <div className="w-40 border-r border-[#e1dfdd] flex flex-col">
            <div className="p-3 border-b border-[#e1dfdd]">
              <div className="flex items-center gap-1 px-2 py-1 border border-[#e1dfdd] rounded bg-white">
                <HiOutlineSearch className="text-[#605e5c]" />
                <input
                  type="text"
                  placeholder="Search"
                  className="text-xs flex-1 outline-none border-0 bg-transparent text-[#201f1e] placeholder:text-[#a19f9d]"
                />
              </div>
            </div>
            <div className="flex-1 text-sm text-[#323130] overflow-y-auto">
              {CATEGORIES.map((item) => (
                <div
                  key={item}
                  className={`px-3 py-2 cursor-default ${
                    item === activeCategory ? 'bg-[#e5f0ff]' : 'hover:bg-[#f3f2f1]'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: connectors list */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-[#e1dfdd] text-sm font-semibold text-[#201f1e]">
              All
            </div>
            <div className="flex-1 text-sm overflow-y-auto">
              {CONNECTORS.map((connector) => {
                const Icon = connector.icon
                const isActive = connector.id === activeConnectorId
                const isClickable = !!connector.isEnabled

                return (
                  <button
                    key={connector.id}
                    type="button"
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 ${
                      isActive ? 'bg-[#e5f0ff]' : 'hover:bg-[#f3f2f1]'
                    } ${!isClickable ? 'cursor-default' : 'cursor-pointer'}`}
                    onClick={() =>
                      isClickable ? handleClickConnector(connector) : undefined
                    }
                  >
                    <span className="h-6 w-6 flex items-center justify-center text-[#605e5c]">
                      <Icon />
                    </span>
                    <span className="text-[#323130]">{connector.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Hidden file input cho Text/CSV */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Footer: full width */}
        <div className="h-11 flex items-center justify-end gap-2 px-4 border-t border-[#e1dfdd] bg-[#f3f2f1]">
          <button className="px-3 py-1 text-xs text-[#0078d4] hover:underline mr-auto">
            Certified Connectors
          </button>
          <button className="px-3 py-1 text-xs text-[#0078d4] hover:underline">
            Template Apps
          </button>
          <button className="px-4 py-1 text-xs rounded bg-[#107c10] text-white font-semibold">
            Connect
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
  )
}

