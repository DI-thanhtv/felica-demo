import { MdOutlineTableChart, MdOutlineFunctions, MdOutlineSchema } from 'react-icons/md'
import { TbDeviceAnalytics } from 'react-icons/tb'
import { RiBarChartLine } from 'react-icons/ri'

type LeftNavItemProps = {
  label: string
  Icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
  onClick?: () => void
}

function LeftNavItem({ label, Icon, isActive = false, onClick }: LeftNavItemProps) {
  return (
    <button
      className={`w-full flex flex-col items-center py-3 text-[10px] ${
        isActive ? 'border-l-2 border-[#107c10] bg-white' : ''
      }`}
      onClick={onClick}
    >
      <div className="mb-1 h-5 w-5 rounded-sm border border-[#a19f9d] bg-white flex items-center justify-center text-[#605e5c]">
        <Icon className="text-base" />
      </div>
      <span className="text-[#605e5c]">{label}</span>
    </button>
  )
}

type LeftNavProps = {
  activeView: 'report' | 'table'
  onChangeView: (view: 'report' | 'table') => void
}

export function LeftNav({ activeView, onChangeView }: LeftNavProps) {
  return (
    <nav className="w-14 border-r border-[#e1dfdd] bg-[#f3f2f1] flex flex-col items-stretch">
      <LeftNavItem
        label="Report"
        Icon={RiBarChartLine}
        isActive={activeView === 'report'}
        onClick={() => onChangeView('report')}
      />
      <LeftNavItem
        label="Table view"
        Icon={MdOutlineTableChart}
        isActive={activeView === 'table'}
        onClick={() => onChangeView('table')}
      />
      <LeftNavItem label="Model" Icon={MdOutlineSchema} />
      <LeftNavItem label="DAX" Icon={MdOutlineFunctions} />
      <LeftNavItem label="TMDL" Icon={TbDeviceAnalytics} />
    </nav>
  )
}

