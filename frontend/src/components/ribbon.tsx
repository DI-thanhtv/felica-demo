import {
  MdContentPaste,
  MdOutlineTableChart,
  MdOutlineViewKanban,
  MdOutlineDataUsage,
  MdOutlineFunctions,
} from 'react-icons/md'
import { TbDatabaseImport, TbDatabaseExport, TbSql } from 'react-icons/tb'
import { AiOutlineFileExcel } from 'react-icons/ai'
import { HiOutlineClipboardCopy } from 'react-icons/hi'
import { RiBarChartLine } from 'react-icons/ri'
import { FiShare2 } from 'react-icons/fi'

type RibbonTabProps = {
  label: string
  isActive?: boolean
}

function RibbonTab({ label, isActive = false }: RibbonTabProps) {
  return (
    <button
      className={`px-3 text-sm h-full flex items-center border-b-2 ${
        isActive
          ? 'border-[#107c10] font-semibold text-[#107c10]'
          : 'border-transparent text-[#323130] hover:bg-[#edebe9]'
      }`}
    >
      {label}
    </button>
  )
}

type RibbonGroupProps = {
  label: string
  children: React.ReactNode
}

function RibbonGroup({ label, children }: RibbonGroupProps) {
  return (
    <div className="flex flex-col items-start px-2 border-r border-[#e1dfdd] last:border-r-0">
      <div className="flex gap-1">{children}</div>
      <div className="mt-1 text-[10px] text-[#605e5c]">{label}</div>
    </div>
  )
}

type RibbonButtonProps = {
  label: string
  Icon?: React.ComponentType<{ className?: string }>
}

function RibbonButton({ label, Icon }: RibbonButtonProps) {
  return (
    <button className="flex flex-col items-center justify-center px-2 py-1 mx-[2px] min-w-[56px] h-[54px] rounded hover:bg-[#edebe9]">
      <div className="mb-1 h-7 w-7 rounded border border-dashed border-[#a19f9d] bg-white flex items-center justify-center text-[#605e5c]">
        {Icon ? <Icon className="text-lg" /> : null}
      </div>
      <span className="text-[11px] text-[#323130] text-center leading-tight">
        {label}
      </span>
    </button>
  )
}

export function Ribbon() {
  return (
    <header className="border-b border-[#e1dfdd] bg-white">
      {/* Tabs row */}
      <div className="flex items-center h-9 px-3 gap-1">
        <span className="mr-4 text-sm text-[#323130] cursor-pointer">File</span>
        <RibbonTab label="Home" isActive />
        <RibbonTab label="Insert" />
        <RibbonTab label="Modeling" />
        <RibbonTab label="View" />
        <RibbonTab label="Optimize" />
        <RibbonTab label="Help" />
        <div className="ml-auto">
          <button className="px-3 py-1 rounded bg-[#107c10] text-white text-xs font-semibold">
            Share
          </button>
        </div>
      </div>

      {/* Commands ribbon */}
      <div className="flex items-stretch h-[88px] px-3 pb-1 bg-white border-t border-[#e1dfdd] text-xs">
        <RibbonGroup label="Clipboard">
          <RibbonButton label="Paste" Icon={MdContentPaste} />
          <RibbonButton label="Copy" Icon={HiOutlineClipboardCopy} />
        </RibbonGroup>
        <RibbonGroup label="Data">
          <RibbonButton label="Get data" Icon={TbDatabaseImport} />
          <RibbonButton label="Excel" Icon={AiOutlineFileExcel} />
          <RibbonButton label="SQL Server" Icon={TbSql} />
          <RibbonButton label="Enter data" Icon={TbDatabaseExport} />
        </RibbonGroup>
        <RibbonGroup label="Queries">
          <RibbonButton label="Transform data" Icon={MdOutlineTableChart} />
          <RibbonButton label="Refresh" Icon={MdOutlineDataUsage} />
        </RibbonGroup>
        <RibbonGroup label="Insert">
          <RibbonButton label="New visual" Icon={RiBarChartLine} />
          <RibbonButton label="Text box" Icon={MdOutlineViewKanban} />
        </RibbonGroup>
        <RibbonGroup label="Calculations">
          <RibbonButton label="New measure" Icon={MdOutlineFunctions} />
          <RibbonButton label="Quick measure" Icon={MdOutlineFunctions} />
        </RibbonGroup>
        <RibbonGroup label="Share">
          <RibbonButton label="Publish" Icon={FiShare2} />
        </RibbonGroup>
        <RibbonGroup label="Copilot">
          <RibbonButton label="Copilot" />
        </RibbonGroup>
      </div>
    </header>
  )
}

