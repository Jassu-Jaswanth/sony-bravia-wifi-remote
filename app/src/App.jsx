import { useEffect, useState } from 'react'
import { useTvStore } from './store/tvStore'
import { sonyApi } from './api/sonyBravia'
import SetupScreen from './components/SetupScreen'
import RemoteControl from './components/RemoteControl'
import { Tv, Wifi, WifiOff } from 'lucide-react'

function App() {
  const { tvIp, psk, connected, setConnected, setTvInfo, setPowerStatus } = useTvStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      if (tvIp && psk) {
        sonyApi.configure(tvIp, psk)
        const isConnected = await sonyApi.testConnection()
        if (isConnected) {
          const info = await sonyApi.getSystemInfo()
          const power = await sonyApi.getPowerStatus()
          setTvInfo(info)
          setPowerStatus(power)
          setConnected(true)
        }
      }
      setLoading(false)
    }
    checkConnection()
  }, [tvIp, psk, setConnected, setTvInfo, setPowerStatus])

  if (loading) {
    return (
      <div className="min-h-screen bg-sony-dark flex items-center justify-center">
        <div className="text-center">
          <Tv className="w-16 h-16 text-sony-accent mx-auto animate-pulse" />
          <p className="text-gray-400 mt-4">Connecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sony-dark text-white">
      <header className="bg-sony-black p-3 flex items-center justify-between border-b border-sony-gray sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Tv className="w-6 h-6 text-sony-accent" />
          <span className="font-semibold">Sony BRAVIA Remote</span>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
        </div>
      </header>

      <main className="pb-20">
        {connected ? <RemoteControl /> : <SetupScreen />}
      </main>
    </div>
  )
}

export default App
