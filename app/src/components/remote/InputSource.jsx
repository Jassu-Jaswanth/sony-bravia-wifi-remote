import { useState, useEffect } from 'react'
import { sonyApi } from '../../api/sonyBravia'
import { Monitor, Cable, Tv, Radio, Loader2, RefreshCw } from 'lucide-react'

export default function InputSource() {
  const [inputs, setInputs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchInputs = async () => {
    setLoading(true)
    const result = await sonyApi.getInputs()
    setInputs(result)
    setLoading(false)
  }

  useEffect(() => {
    fetchInputs()
  }, [])

  const selectInput = async (uri) => {
    await sonyApi.setInput(uri)
  }

  const sendCommand = (cmd) => {
    sonyApi.sendIRCC(cmd)
  }

  const getIcon = (title) => {
    const t = title.toLowerCase()
    if (t.includes('hdmi')) return Cable
    if (t.includes('tv') || t.includes('tuner')) return Tv
    if (t.includes('radio')) return Radio
    return Monitor
  }

  const quickInputs = [
    { cmd: 'Hdmi1', label: 'HDMI 1' },
    { cmd: 'Hdmi2', label: 'HDMI 2' },
    { cmd: 'Hdmi3', label: 'HDMI 3' },
    { cmd: 'Hdmi4', label: 'HDMI 4' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Input Sources</h2>
        <button
          onClick={fetchInputs}
          className="btn-remote w-10 h-10"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Quick HDMI buttons */}
      <div className="grid grid-cols-4 gap-2">
        {quickInputs.map(({ cmd, label }) => (
          <button
            key={cmd}
            onClick={() => sendCommand(cmd)}
            className="btn-remote flex-col py-3 gap-1"
          >
            <Cable className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>

      {/* Detected inputs */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : inputs.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Detected Inputs</p>
          <div className="grid gap-2">
            {inputs.map((input) => {
              const Icon = getIcon(input.title)
              return (
                <button
                  key={input.uri}
                  onClick={() => selectInput(input.uri)}
                  className={`btn-remote justify-start gap-3 p-3 ${
                    input.connection ? '' : 'opacity-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">{input.label || input.title}</p>
                    <p className="text-xs text-gray-400">
                      {input.connection ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 py-4">
          No external inputs detected
        </p>
      )}

      {/* Input button */}
      <div className="flex justify-center">
        <button
          onClick={() => sendCommand('Input')}
          className="btn-remote px-8 py-3 bg-sony-accent hover:bg-blue-600"
        >
          <span>Open Input Menu</span>
        </button>
      </div>
    </div>
  )
}
