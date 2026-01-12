import { sonyApi } from '../../api/sonyBravia'
import { 
  Play, Pause, Square, SkipBack, SkipForward, 
  Rewind, FastForward, Circle, ChevronUp, ChevronDown 
} from 'lucide-react'

export default function MediaControls() {
  const sendCommand = (cmd) => {
    sonyApi.sendIRCC(cmd)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-center">Media Controls</h2>
      
      {/* Playback controls */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => sendCommand('Rewind')}
            className="btn-remote btn-media"
          >
            <Rewind className="w-6 h-6" />
          </button>
          <button
            onClick={() => sendCommand('Play')}
            className="btn-remote w-16 h-16 bg-sony-accent hover:bg-blue-600"
          >
            <Play className="w-8 h-8" />
          </button>
          <button
            onClick={() => sendCommand('Forward')}
            className="btn-remote btn-media"
          >
            <FastForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => sendCommand('Prev')}
            className="btn-remote btn-media"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button
            onClick={() => sendCommand('Pause')}
            className="btn-remote btn-media"
          >
            <Pause className="w-6 h-6" />
          </button>
          <button
            onClick={() => sendCommand('Stop')}
            className="btn-remote btn-media"
          >
            <Square className="w-6 h-6" />
          </button>
          <button
            onClick={() => sendCommand('Next')}
            className="btn-remote btn-media"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={() => sendCommand('Rec')}
          className="btn-remote btn-media bg-sony-red hover:bg-red-600"
        >
          <Circle className="w-6 h-6 fill-current" />
        </button>
      </div>

      {/* Channel controls */}
      <div className="flex justify-center">
        <div className="bg-sony-gray rounded-xl p-2 flex flex-col items-center gap-2">
          <button
            onClick={() => sendCommand('ChannelUp')}
            className="btn-remote w-20 h-12"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className="text-sm text-gray-400">CH</span>
          <button
            onClick={() => sendCommand('ChannelDown')}
            className="btn-remote w-20 h-12"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Additional media options */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => sendCommand('Audio')}
          className="btn-remote h-12"
        >
          <span className="text-xs">Audio</span>
        </button>
        <button
          onClick={() => sendCommand('SubTitle')}
          className="btn-remote h-12"
        >
          <span className="text-xs">Subtitle</span>
        </button>
        <button
          onClick={() => sendCommand('Display')}
          className="btn-remote h-12"
        >
          <span className="text-xs">Display</span>
        </button>
        <button
          onClick={() => sendCommand('Wide')}
          className="btn-remote h-12"
        >
          <span className="text-xs">Wide</span>
        </button>
        <button
          onClick={() => sendCommand('PictureMode')}
          className="btn-remote h-12"
        >
          <span className="text-xs">Picture</span>
        </button>
        <button
          onClick={() => sendCommand('Mode3D')}
          className="btn-remote h-12"
        >
          <span className="text-xs">3D</span>
        </button>
      </div>
    </div>
  )
}
