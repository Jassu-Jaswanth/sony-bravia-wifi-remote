import { sonyApi } from '../../api/sonyBravia'
import { 
  Home, Settings, HelpCircle, Menu, Tv, 
  Bookmark, LayoutGrid, MonitorPlay 
} from 'lucide-react'

export default function QuickActions() {
  const sendCommand = (cmd) => {
    sonyApi.sendIRCC(cmd)
  }

  const actions = [
    { cmd: 'Home', icon: Home, label: 'Home' },
    { cmd: 'Guide', icon: LayoutGrid, label: 'Guide' },
    { cmd: 'Input', icon: MonitorPlay, label: 'Input' },
    { cmd: 'ActionMenu', icon: Menu, label: 'Action' },
    { cmd: 'Settings', icon: Settings, label: 'Settings' },
    { cmd: 'Favorites', icon: Bookmark, label: 'Favorites' },
    { cmd: 'Help', icon: HelpCircle, label: 'Help' },
    { cmd: 'SyncMenu', icon: Tv, label: 'Sync' },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map(({ cmd, icon: Icon, label }) => (
        <button
          key={cmd}
          onClick={() => sendCommand(cmd)}
          className="btn-remote flex-col py-3 gap-1"
        >
          <Icon className="w-5 h-5" />
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </div>
  )
}
