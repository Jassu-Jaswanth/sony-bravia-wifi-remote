import { useState } from 'react'
import { useTvStore } from '../store/tvStore'
import { sonyApi } from '../api/sonyBravia'
import { Search, Wifi, Loader2, Tv, AlertCircle } from 'lucide-react'

export default function SetupScreen() {
  const { tvIp, psk, setTvIp, setPsk, setConnected, setTvInfo, setPowerStatus, discoveredTvs, setDiscoveredTvs, isScanning, setIsScanning } = useTvStore()
  const [localIp, setLocalIp] = useState(tvIp)
  const [localPsk, setLocalPsk] = useState(psk)
  const [error, setError] = useState('')
  const [connecting, setConnecting] = useState(false)

  const scanNetwork = async () => {
    setIsScanning(true)
    setError('')
    setDiscoveredTvs([])
    
    const baseIp = localIp ? localIp.split('.').slice(0, 3).join('.') : '192.168.1'
    const found = []
    
    const checkIp = async (ip) => {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 1500)
        
        const response = await fetch(`http://${ip}/sony/system`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method: 'getSystemInformation', params: [], id: 1, version: '1.0' }),
          signal: controller.signal
        })
        clearTimeout(timeout)
        
        if (response.ok) {
          const data = await response.json()
          if (data.result) {
            return { ip, info: data.result[0] }
          }
        }
      } catch {}
      return null
    }

    const batchSize = 20
    for (let i = 1; i <= 254; i += batchSize) {
      const batch = []
      for (let j = i; j < Math.min(i + batchSize, 255); j++) {
        batch.push(checkIp(`${baseIp}.${j}`))
      }
      const results = await Promise.all(batch)
      results.forEach(r => {
        if (r) {
          found.push(r)
          setDiscoveredTvs([...found])
        }
      })
    }

    setIsScanning(false)
    if (found.length === 0) {
      setError('No Sony TVs found. Make sure your TV is on and IP Control is enabled.')
    }
  }

  const connect = async () => {
    if (!localIp || !localPsk) {
      setError('Please enter both IP address and PSK')
      return
    }

    setConnecting(true)
    setError('')

    sonyApi.configure(localIp, localPsk)
    const success = await sonyApi.testConnection()

    if (success) {
      const info = await sonyApi.getSystemInfo()
      const power = await sonyApi.getPowerStatus()
      setTvIp(localIp)
      setPsk(localPsk)
      setTvInfo(info)
      setPowerStatus(power)
      setConnected(true)
    } else {
      setError('Connection failed. Check IP, PSK, and ensure IP Control is enabled on your TV.')
    }

    setConnecting(false)
  }

  const selectTv = (ip) => {
    setLocalIp(ip)
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="text-center mb-8 mt-4">
        <Tv className="w-20 h-20 text-sony-accent mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Connect to Your TV</h1>
        <p className="text-gray-400 text-sm">
          Enter your Sony BRAVIA TV's IP address and Pre-Shared Key
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">TV IP Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={localIp}
              onChange={(e) => setLocalIp(e.target.value)}
              placeholder="192.168.1.100"
              className="flex-1 bg-sony-gray rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sony-accent"
            />
            <button
              onClick={scanNetwork}
              disabled={isScanning}
              className="bg-sony-gray hover:bg-sony-light rounded-lg px-4 py-3 transition-colors disabled:opacity-50"
            >
              {isScanning ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {discoveredTvs.length > 0 && (
          <div className="bg-sony-gray rounded-lg p-3">
            <p className="text-sm text-gray-400 mb-2">Discovered TVs:</p>
            <div className="space-y-2">
              {discoveredTvs.map((tv) => (
                <button
                  key={tv.ip}
                  onClick={() => selectTv(tv.ip)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    localIp === tv.ip ? 'bg-sony-accent' : 'bg-sony-dark hover:bg-sony-light'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    <div>
                      <p className="font-medium">{tv.info?.model || 'Sony TV'}</p>
                      <p className="text-xs text-gray-400">{tv.ip}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1">Pre-Shared Key (PSK)</label>
          <input
            type="password"
            value={localPsk}
            onChange={(e) => setLocalPsk(e.target.value)}
            placeholder="Enter your PSK"
            className="w-full bg-sony-gray rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sony-accent"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={connect}
          disabled={connecting}
          className="w-full bg-sony-accent hover:bg-blue-600 rounded-lg py-3 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {connecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect'
          )}
        </button>
      </div>

      <div className="mt-8 p-4 bg-sony-gray/50 rounded-lg">
        <h3 className="font-semibold mb-2">Setup Instructions</h3>
        <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
          <li>Go to TV Settings → Network → Home Network</li>
          <li>Enable IP Control</li>
          <li>Set Authentication to "Pre-Shared Key"</li>
          <li>Create a PSK (e.g., "1234")</li>
          <li>Note your TV's IP address from Network Settings</li>
        </ol>
      </div>
    </div>
  )
}
