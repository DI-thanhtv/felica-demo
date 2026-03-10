import { MdOutlineTableChart, MdOutlineFunctions, MdOutlineSchema } from 'react-icons/md'
import { TbDeviceAnalytics } from 'react-icons/tb'
import { RiBarChartLine } from 'react-icons/ri'

type LeftNavItemProps = {
  label: string
  Icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
}

function LeftNavItem({ label, Icon, isActive = false }: LeftNavItemProps) {
  return (
    <button
      className={`w-full flex flex-col items-center py-3 text-[10px] ${
        isActive ? 'border-l-2 border-[#107c10] bg-white' : ''
      }`}
    >
      <div className="mb-1 h-5 w-5 rounded-sm border border-[#a19f9d] bg-white flex items-center justify-center text-[#605e5c]">
        <Icon className="text-base" />
      </div>
      <span className="text-[#605e5c]">{label}</span>
    </button>
  )
}

export function LeftNav() {
  return (
    <nav className="w-14 border-r border-[#e1dfdd] bg-[#f3f2f1] flex flex-col items-stretch">
      <LeftNavItem label="Report" Icon={RiBarChartLine} isActive />
      <LeftNavItem label="Data" Icon={MdOutlineTableChart} />
      <LeftNavItem label="Model" Icon={MdOutlineSchema} />
      <LeftNavItem label="DAX" Icon={MdOutlineFunctions} />
      <LeftNavItem label="TMDL" Icon={TbDeviceAnalytics} />
    </nav>
  )
}

