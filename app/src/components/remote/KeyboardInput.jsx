import { useState, useRef, useEffect, useCallback } from 'react'
import { sonyApi } from '../../api/sonyBravia'
import { Keyboard, Send, Mic, MicOff, CornerDownLeft, Delete, Loader2, Mouse } from 'lucide-react'

export default function KeyboardInput() {
  const [mode, setMode] = useState('direct') // 'direct' or 'batch'
  const [typedText, setTypedText] = useState('')
  const [batchText, setBatchText] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [sending, setSending] = useState(false)
  const [lastKey, setLastKey] = useState('')
  const [voiceActive, setVoiceActive] = useState(false)
  const [voiceSupported] = useState('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  const inputRef = useRef(null)

  // Focus input when direct mode is activated
  useEffect(() => {
    if (isActive && mode === 'direct' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive, mode])

  const handleKeyDown = async (e) => {
    if (mode !== 'direct') return
    
    const key = e.key
    setLastKey(key)

    // Handle special keys
    if (key === 'Enter') {
      e.preventDefault()
      await sonyApi.sendIRCC('Confirm')
      setTypedText(prev => prev + '↵')
    } else if (key === 'Backspace') {
      e.preventDefault()
      await sonyApi.sendIRCC('Return')
      setTypedText(prev => prev.slice(0, -1))
    } else if (key === 'ArrowUp') {
      e.preventDefault()
      await sonyApi.sendIRCC('Up')
    } else if (key === 'ArrowDown') {
      e.preventDefault()
      await sonyApi.sendIRCC('Down')
    } else if (key === 'ArrowLeft') {
      e.preventDefault()
      await sonyApi.sendIRCC('Left')
    } else if (key === 'ArrowRight') {
      e.preventDefault()
      await sonyApi.sendIRCC('Right')
    } else if (key === 'Escape') {
      e.preventDefault()
      await sonyApi.sendIRCC('Return')
    } else if (key.length === 1) {
      // Single character - send it
      e.preventDefault()
      await sonyApi.sendText(key)
      setTypedText(prev => prev + key)
    }
  }

  const clearTyped = () => {
    setTypedText('')
  }

  const sendBatchText = async () => {
    if (!batchText.trim()) return
    setSending(true)
    try {
      await sonyApi.sendText(batchText)
      setBatchText('')
    } catch (error) {
      console.error('Failed to send text:', error)
    }
    setSending(false)
  }

  const sendEnter = async () => {
    await sonyApi.sendIRCC('Confirm')
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => setVoiceActive(true)
    recognition.onend = () => setVoiceActive(false)
    recognition.onerror = () => setVoiceActive(false)

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript
      if (mode === 'direct') {
        // Send each character
        for (const char of transcript) {
          await sonyApi.sendText(char)
          setTypedText(prev => prev + char)
          await new Promise(r => setTimeout(r, 30))
        }
      } else {
        setBatchText(transcript)
      }
    }

    recognition.start()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center">Keyboard Input</h2>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setMode('direct')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'direct' ? 'bg-sony-accent text-white' : 'bg-sony-gray text-gray-300'
          }`}
        >
          Direct Keys
        </button>
        <button
          onClick={() => setMode('batch')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === 'batch' ? 'bg-sony-accent text-white' : 'bg-sony-gray text-gray-300'
          }`}
        >
          Send Text
        </button>
      </div>

      {mode === 'direct' ? (
        <>
          {/* Direct keystroke mode */}
          <div className="text-center text-sm text-gray-400 mb-2">
            Each keystroke is sent directly to TV
          </div>

          {/* Invisible input to capture keystrokes */}
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute -z-10 w-0 h-0"
            onKeyDown={handleKeyDown}
            onBlur={() => setIsActive(false)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {/* Activation button / status */}
          {isActive ? (
            <div
              className="w-full py-6 rounded-xl border-2 border-dashed border-sony-accent bg-sony-accent/10 text-white"
            >
              <Keyboard className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <div className="text-center">
                <p className="font-medium text-green-400">Keyboard Active</p>
                <p className="text-xs mt-1">Type on your keyboard - keys go directly to TV</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsActive(false)
                    inputRef.current?.blur()
                  }}
                  className="mt-3 px-4 py-1 bg-sony-gray hover:bg-sony-light rounded text-sm"
                >
                  Deactivate
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsActive(true)
                inputRef.current?.focus()
              }}
              className="w-full py-6 rounded-xl border-2 border-dashed border-sony-gray bg-sony-gray/30 text-gray-400 hover:border-gray-500 transition-all"
            >
              <Keyboard className="w-10 h-10 mx-auto mb-2" />
              <div>
                <p className="font-medium">Tap to Activate Keyboard</p>
                <p className="text-xs mt-1">Then type using your device keyboard</p>
              </div>
            </button>
          )}

          {/* Last key indicator */}
          {lastKey && (
            <div className="text-center">
              <span className="text-xs text-gray-500">Last key: </span>
              <span className="text-sm font-mono bg-sony-gray px-2 py-1 rounded">
                {lastKey === ' ' ? 'Space' : lastKey}
              </span>
            </div>
          )}

          {/* Typed text preview */}
          {typedText && (
            <div className="bg-sony-gray rounded-lg px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Sent:</span>
                <button onClick={clearTyped} className="text-xs text-gray-500 hover:text-white">
                  Clear
                </button>
              </div>
              <p className="text-white font-mono text-sm break-all">{typedText}</p>
            </div>
          )}

          {/* Quick actions */}
          <div className="flex justify-center gap-2">
            <button
              onClick={sendEnter}
              className="btn-remote px-6 h-12 bg-green-600 hover:bg-green-500 gap-2"
            >
              <CornerDownLeft className="w-5 h-5" />
              <span>Enter</span>
            </button>
            <button
              onClick={() => sonyApi.sendIRCC('Return')}
              className="btn-remote px-6 h-12 gap-2"
            >
              <Delete className="w-5 h-5" />
              <span>Delete</span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Batch text mode */}
          <div className="text-center text-sm text-gray-400 mb-2">
            Type full text, then send all at once
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendBatchText()}
              placeholder="Type text to send..."
              className="flex-1 bg-sony-gray rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sony-accent"
            />
            <button
              onClick={sendBatchText}
              disabled={sending || !batchText.trim()}
              className="btn-remote w-12 h-12 bg-sony-accent hover:bg-blue-600 disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            onClick={sendEnter}
            className="w-full btn-remote h-12 bg-green-600 hover:bg-green-500 gap-2"
          >
            <CornerDownLeft className="w-5 h-5" />
            <span>Send Enter</span>
          </button>

          {/* Quick words */}
          <div className="flex flex-wrap justify-center gap-2">
            {['Netflix', 'YouTube', 'Search', 'Movie', 'Music'].map((word) => (
              <button
                key={word}
                onClick={() => setBatchText(word)}
                className="bg-sony-gray hover:bg-sony-light px-3 py-1 rounded-full text-sm transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Voice input */}
      {voiceSupported && (
        <div className="flex flex-col items-center gap-2 pt-4 border-t border-sony-gray">
          <button
            onClick={startVoice}
            className={`btn-remote w-14 h-14 rounded-full ${
              voiceActive ? 'bg-sony-red animate-pulse' : 'bg-sony-gray hover:bg-sony-light'
            }`}
          >
            {voiceActive ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
          <span className="text-xs text-gray-500">
            {voiceActive ? 'Listening...' : 'Voice Input'}
          </span>
        </div>
      )}
    </div>
  )
}
