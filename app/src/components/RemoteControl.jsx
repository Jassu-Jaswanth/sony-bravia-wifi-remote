import { useState } from 'react'
import { useTvStore } from '../store/tvStore'
import PowerVolume from './remote/PowerVolume'
import Navigation from './remote/Navigation'
import MediaControls from './remote/MediaControls'
import NumPad from './remote/NumPad'
import QuickActions from './remote/QuickActions'
import ColorButtons from './remote/ColorButtons'
import KeyboardInput from './remote/KeyboardInput'
import InputSource from './remote/InputSource'
import AppLauncher from './remote/AppLauncher'
import Settings from './remote/Settings'
import { 
  Power, Volume2, Navigation as NavIcon, Play, Grid3X3, 
  Keyboard, Monitor, AppWindow, Settings as SettingsIcon, LogOut 
} from 'lucide-react'

const tabs = [
  { id: 'main', icon: NavIcon, label: 'Remote' },
  { id: 'numpad', icon: Grid3X3, label: 'NumPad' },
  { id: 'media', icon: Play, label: 'Media' },
  { id: 'keyboard', icon: Keyboard, label: 'Keys' },
  { id: 'inputs', icon: Monitor, label: 'Inputs' },
  { id: 'apps', icon: AppWindow, label: 'Apps' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
]

export default function RemoteControl() {
  const [activeTab, setActiveTab] = useState('main')
  const { tvInfo, disconnect } = useTvStore()

  const renderTab = () => {
    switch (activeTab) {
      case 'main':
        return (
          <div className="space-y-6">
            <PowerVolume />
            <Navigation />
            <QuickActions />
            <ColorButtons />
          </div>
        )
      case 'numpad':
        return <NumPad />
      case 'media':
        return <MediaControls />
      case 'keyboard':
        return <KeyboardInput />
      case 'inputs':
        return <InputSource />
      case 'apps':
        return <AppLauncher />
      case 'settings':
        return <Settings />
      default:
        return null
    }
  }

  return (
    <div className="pb-20">
      {tvInfo && (
        <div className="px-4 py-2 bg-sony-gray/30 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Connected to</p>
            <p className="font-medium">{tvInfo.model || 'Sony BRAVIA'}</p>
          </div>
          <button
            onClick={disconnect}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      )}

      <div className="p-4">
        {renderTab()}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-sony-black border-t border-sony-gray">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                activeTab === tab.id ? 'text-sony-accent' : 'text-gray-500'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
