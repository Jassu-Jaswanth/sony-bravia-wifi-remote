import { useState, useEffect } from 'react'
import { sonyApi } from '../../api/sonyBravia'
import { useTvStore } from '../../store/tvStore'
import { Power, Volume2, VolumeX, Volume1 } from 'lucide-react'

export default function PowerVolume() {
  const { powerStatus, setPowerStatus, volume, setVolume, muted, setMuted } = useTvStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchVolume = async () => {
      const info = await sonyApi.getVolumeInfo()
      setVolume(info.volume || 0)
      setMuted(info.mute || false)
    }
    fetchVolume()
  }, [setVolume, setMuted])

  const togglePower = async () => {
    setLoading(true)
    if (powerStatus === 'active') {
      await sonyApi.powerOff()
      setPowerStatus('standby')
    } else {
      await sonyApi.powerOn()
      setPowerStatus('active')
    }
    setLoading(false)
  }

  const adjustVolume = async (direction) => {
    await sonyApi.adjustVolume(direction)
    setVolume(Math.max(0, Math.min(100, volume + direction)))
  }

  const toggleMute = async () => {
    await sonyApi.setMute(!muted)
    setMuted(!muted)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <button
        onClick={togglePower}
        disabled={loading}
        className={`btn-remote w-16 h-16 ${
          powerStatus === 'active' ? 'btn-power' : 'bg-sony-gray'
        }`}
      >
        <Power className="w-8 h-8" />
      </button>

      <div className="flex-1 flex items-center gap-3 bg-sony-gray rounded-xl p-2">
        <button
          onClick={() => adjustVolume(-1)}
          className="btn-remote w-12 h-12"
        >
          <Volume1 className="w-5 h-5" />
        </button>
        
        <div className="flex-1">
          <div className="h-2 bg-sony-dark rounded-full overflow-hidden">
            <div 
              className="h-full bg-sony-accent transition-all duration-150"
              style={{ width: `${muted ? 0 : volume}%` }}
            />
          </div>
          <p className="text-xs text-center text-gray-400 mt-1">
            {muted ? 'Muted' : `${volume}%`}
          </p>
        </div>

        <button
          onClick={() => adjustVolume(1)}
          className="btn-remote w-12 h-12"
        >
          <Volume2 className="w-5 h-5" />
        </button>

        <button
          onClick={toggleMute}
          className={`btn-remote w-12 h-12 ${muted ? 'bg-sony-accent' : ''}`}
        >
          <VolumeX className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
