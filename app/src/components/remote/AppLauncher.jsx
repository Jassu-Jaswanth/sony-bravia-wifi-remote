import { useState, useEffect } from 'react'
import { sonyApi } from '../../api/sonyBravia'
import { Loader2, RefreshCw, AppWindow } from 'lucide-react'

export default function AppLauncher() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchApps = async () => {
    setLoading(true)
    const result = await sonyApi.getApps()
    setApps(result)
    setLoading(false)
  }

  useEffect(() => {
    fetchApps()
  }, [])

  const launchApp = async (uri) => {
    await sonyApi.launchApp(uri)
  }

  const sendCommand = (cmd) => {
    sonyApi.sendIRCC(cmd)
  }

  const quickApps = [
    { cmd: 'Netflix', label: 'Netflix', color: 'bg-red-600' },
    { cmd: 'YouTube', label: 'YouTube', color: 'bg-red-500' },
    { cmd: 'GooglePlay', label: 'Play Store', color: 'bg-green-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Apps</h2>
        <button
          onClick={fetchApps}
          className="btn-remote w-10 h-10"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quick app buttons */}
      <div className="grid grid-cols-3 gap-3">
        {quickApps.map(({ cmd, label, color }) => (
          <button
            key={cmd}
            onClick={() => sendCommand(cmd)}
            className={`btn-remote flex-col py-4 gap-2 ${color} hover:opacity-90`}
          >
            <AppWindow className="w-6 h-6" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* App list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : apps.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Installed Apps</p>
          <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto scrollbar-hide">
            {apps.map((app) => (
              <button
                key={app.uri}
                onClick={() => launchApp(app.uri)}
                className="btn-remote flex-col py-3 gap-2"
              >
                {app.icon ? (
                  <img 
                    src={app.icon} 
                    alt={app.title}
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <AppWindow className="w-6 h-6" />
                )}
                <span className="text-xs truncate w-full px-1">{app.title}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No apps found</p>
          <p className="text-xs text-gray-500 mt-1">
            App list may not be available on all TV models
          </p>
        </div>
      )}
    </div>
  )
}
