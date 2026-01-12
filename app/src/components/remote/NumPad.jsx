import { sonyApi } from '../../api/sonyBravia'

export default function NumPad() {
  const sendCommand = (cmd) => {
    sonyApi.sendIRCC(cmd)
  }

  const numbers = [
    ['Num1', '1'], ['Num2', '2'], ['Num3', '3'],
    ['Num4', '4'], ['Num5', '5'], ['Num6', '6'],
    ['Num7', '7'], ['Num8', '8'], ['Num9', '9'],
    ['DOT', '.'], ['Num0', '0'], ['Jump', '⏎'],
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-center">Number Pad</h2>
      
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {numbers.map(([cmd, label]) => (
          <button
            key={cmd}
            onClick={() => sendCommand(cmd)}
            className="btn-remote btn-numpad"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Quick channel access */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400 text-center">Quick Access</p>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => sendCommand('Digital')}
            className="btn-remote h-10"
          >
            <span className="text-xs">Digital</span>
          </button>
          <button
            onClick={() => sendCommand('Analog')}
            className="btn-remote h-10"
          >
            <span className="text-xs">Analog</span>
          </button>
          <button
            onClick={() => sendCommand('BS')}
            className="btn-remote h-10"
          >
            <span className="text-xs">BS</span>
          </button>
          <button
            onClick={() => sendCommand('CS')}
            className="btn-remote h-10"
          >
            <span className="text-xs">CS</span>
          </button>
        </div>
      </div>

      {/* Teletext */}
      <div className="flex justify-center">
        <button
          onClick={() => sendCommand('Teletext')}
          className="btn-remote px-6 h-12"
        >
          <span className="text-sm">Teletext</span>
        </button>
      </div>
    </div>
  )
}
