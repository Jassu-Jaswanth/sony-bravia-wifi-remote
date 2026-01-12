import { useState } from 'react'
import { useTvStore } from '../../store/tvStore'
import { Settings2, RotateCcw, Save, Terminal, Info } from 'lucide-react'

export default function Settings() {
  const { adbPath, adbPort, setAdbPath, setAdbPort, resetSettings, tvIp, psk } = useTvStore()
  const [localAdbPath, setLocalAdbPath] = useState(adbPath)
  const [localAdbPort, setLocalAdbPort] = useState(adbPort)
  const [saved, setSaved] = useState(false)

  const platform = navigator.platform?.toLowerCase() || ''
  const getPlatformName = () => {
    if (platform.includes('mac')) return 'macOS'
    if (platform.includes('win')) return 'Windows'
    if (platform.includes('linux')) return 'Linux'
    return 'Unknown'
  }

  const getDefaultPathHint = () => {
    if (platform.includes('mac')) {
      return 'Apple Silicon: /opt/homebrew/bin/adb\nIntel Mac: /usr/local/bin/adb'
    }
    if (platform.includes('win')) {
      return 'C:\\Users\\<user>\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe'
    }
    if (platform.includes('linux')) {
      return '/usr/bin/adb or ~/Android/Sdk/platform-tools/adb'
    }
    return 'adb'
  }

  const handleSave = () => {
    setAdbPath(localAdbPath)
    setAdbPort(localAdbPort)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    resetSettings()
    setLocalAdbPath(adbPath)
    setLocalAdbPort(adbPort)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2">
        <Settings2 className="w-6 h-6" />
        <h2 className="text-lg font-semibold">Settings</h2>
      </div>

      {/* Platform Info */}
      <div className="bg-sony-gray/50 rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Info className="w-4 h-4" />
          <span>Platform: <span className="text-white">{getPlatformName()}</span></span>
        </div>
      </div>

      {/* ADB Settings */}
      <div className="bg-sony-gray rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-white font-medium">
          <Terminal className="w-5 h-5" />
          <span>ADB Configuration</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">ADB Binary Path</label>
            <input
              type="text"
              value={localAdbPath}
              onChange={(e) => setLocalAdbPath(e.target.value)}
              className="w-full bg-sony-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sony-accent"
              placeholder="/path/to/adb"
            />
            <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{getDefaultPathHint()}</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Default ADB Port</label>
            <input
              type="text"
              value={localAdbPort}
              onChange={(e) => setLocalAdbPort(e.target.value)}
              className="w-full bg-sony-dark rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sony-accent"
              placeholder="5555"
            />
            <p className="text-xs text-gray-500 mt-1">Standard Android TV ADB port is 5555</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            className={`flex-1 btn-remote h-10 gap-2 ${saved ? 'bg-green-600' : 'bg-sony-accent hover:bg-blue-600'}`}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save'}
          </button>
          <button
            onClick={handleReset}
            className="btn-remote h-10 px-4 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Connection Info */}
      <div className="bg-sony-gray rounded-lg p-4 space-y-3">
        <h3 className="text-white font-medium">Current Connection</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">TV IP Address</span>
            <span className="text-white font-mono">{tvIp || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">PSK</span>
            <span className="text-white font-mono">{psk ? '••••••••' : 'Not set'}</span>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="bg-sony-gray/30 rounded-lg p-4 text-sm text-gray-400">
        <h3 className="text-white font-medium mb-2">Finding ADB Path</h3>
        <p className="mb-2">Run in terminal to find your ADB location:</p>
        <code className="block bg-sony-dark rounded px-2 py-1 text-xs text-green-400 mb-2">
          {platform.includes('win') ? 'where adb' : 'which adb'}
        </code>
        <p className="text-xs">
          If ADB is not installed, install via Android Studio or:<br/>
          • macOS: <code className="text-green-400">brew install android-platform-tools</code><br/>
          • Linux: <code className="text-green-400">sudo apt install adb</code>
        </p>
      </div>
    </div>
  )
}
