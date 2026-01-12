import { sonyApi } from '../../api/sonyBravia'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Circle, CornerDownLeft } from 'lucide-react'

export default function Navigation() {
  const sendCommand = (cmd) => {
    sonyApi.sendIRCC(cmd)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-56">
        {/* Up */}
        <button
          onClick={() => sendCommand('Up')}
          className="btn-remote absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-t-full"
        >
          <ChevronUp className="w-8 h-8" />
        </button>

        {/* Down */}
        <button
          onClick={() => sendCommand('Down')}
          className="btn-remote absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-b-full"
        >
          <ChevronDown className="w-8 h-8" />
        </button>

        {/* Left */}
        <button
          onClick={() => sendCommand('Left')}
          className="btn-remote absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-l-full"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Right */}
        <button
          onClick={() => sendCommand('Right')}
          className="btn-remote absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 rounded-r-full"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Center OK */}
        <button
          onClick={() => sendCommand('Confirm')}
          className="btn-remote absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-sony-accent hover:bg-blue-600"
        >
          <span className="font-bold text-lg">OK</span>
        </button>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => sendCommand('Return')}
          className="btn-remote w-20 h-12 gap-1"
        >
          <CornerDownLeft className="w-5 h-5" />
          <span className="text-xs">Back</span>
        </button>
        <button
          onClick={() => sendCommand('Home')}
          className="btn-remote w-20 h-12 gap-1"
        >
          <Circle className="w-4 h-4 fill-current" />
          <span className="text-xs">Home</span>
        </button>
        <button
          onClick={() => sendCommand('Exit')}
          className="btn-remote w-20 h-12"
        >
          <span className="text-xs">Exit</span>
        </button>
      </div>
    </div>
  )
}
