import { sonyApi } from '../../api/sonyBravia'

export default function ColorButtons() {
  const sendCommand = (cmd) => {
    sonyApi.sendIRCC(cmd)
  }

  const colors = [
    { cmd: 'Red', color: 'bg-red-600 hover:bg-red-500' },
    { cmd: 'Green', color: 'bg-green-600 hover:bg-green-500' },
    { cmd: 'Yellow', color: 'bg-yellow-500 hover:bg-yellow-400' },
    { cmd: 'Blue', color: 'bg-blue-600 hover:bg-blue-500' },
  ]

  return (
    <div className="flex gap-2 justify-center">
      {colors.map(({ cmd, color }) => (
        <button
          key={cmd}
          onClick={() => sendCommand(cmd)}
          className={`w-14 h-8 rounded-full ${color} transition-colors active:scale-95`}
        />
      ))}
    </div>
  )
}
