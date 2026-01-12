import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Platform-specific ADB path defaults
const getDefaultAdbPath = () => {
  const platform = navigator.platform?.toLowerCase() || ''
  const userAgent = navigator.userAgent?.toLowerCase() || ''
  
  if (platform.includes('mac') || userAgent.includes('mac')) {
    // Check if Apple Silicon (arm64) or Intel
    // Most modern Macs use homebrew in /opt/homebrew (ARM) or /usr/local (Intel)
    return '/opt/homebrew/bin/adb'
  } else if (platform.includes('win') || userAgent.includes('win')) {
    // Windows - common Android SDK location
    return 'C:\\Users\\%USERNAME%\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe'
  } else if (platform.includes('linux') || userAgent.includes('linux')) {
    // Linux - usually in PATH or Android SDK
    return '/usr/bin/adb'
  }
  return 'adb' // Fallback to PATH
}

export const useTvStore = create(
  persist(
    (set, get) => ({
      tvIp: '',
      psk: '',
      connected: false,
      tvInfo: null,
      volume: 0,
      muted: false,
      powerStatus: 'unknown',
      discoveredTvs: [],
      isScanning: false,
      
      // Settings
      adbPath: getDefaultAdbPath(),
      adbPort: '5555',
      
      setTvIp: (ip) => set({ tvIp: ip }),
      setPsk: (psk) => set({ psk }),
      setConnected: (connected) => set({ connected }),
      setTvInfo: (info) => set({ tvInfo: info }),
      setVolume: (volume) => set({ volume }),
      setMuted: (muted) => set({ muted }),
      setPowerStatus: (status) => set({ powerStatus: status }),
      setDiscoveredTvs: (tvs) => set({ discoveredTvs: tvs }),
      setIsScanning: (scanning) => set({ isScanning: scanning }),
      setAdbPath: (path) => set({ adbPath: path }),
      setAdbPort: (port) => set({ adbPort: port }),
      
      disconnect: () => set({ 
        connected: false, 
        tvInfo: null, 
        powerStatus: 'unknown' 
      }),
      
      resetSettings: () => set({
        adbPath: getDefaultAdbPath(),
        adbPort: '5555',
      }),
    }),
    {
      name: 'sony-remote-storage',
      partialize: (state) => ({ 
        tvIp: state.tvIp, 
        psk: state.psk,
        adbPath: state.adbPath,
        adbPort: state.adbPort,
      }),
    }
  )
)
