'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Waveform } from '@/components/waveform'

export function FreeTtsPanel({ text }: { text: string }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURI] = useState<string>('')
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(true)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false)
      return
    }

    const load = () => {
      const list = window.speechSynthesis.getVoices()
      if (list.length) {
        setVoices(list)
        setVoiceURI((prev) => {
          if (prev) return prev
          const preferred =
            list.find((v) => v.lang.startsWith('en') && v.default) ??
            list.find((v) => v.lang.startsWith('en')) ??
            list[0]
          return preferred?.voiceURI ?? ''
        })
      }
    }

    load()
    window.speechSynthesis.onvoiceschanged = load

    return () => {
      window.speechSynthesis.onvoiceschanged = null
      window.speechSynthesis.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(() => {
    if (!text.trim() || !supported) return
    window.speechSynthesis.cancel()

    const utter = new SpeechSynthesisUtterance(text.trim())
    const voice = voices.find((v) => v.voiceURI === voiceURI)
    if (voice) utter.voice = voice
    utter.rate = rate
    utter.pitch = pitch
    utter.onend = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    utteranceRef.current = utter

    setSpeaking(true)
    window.speechSynthesis.speak(utter)
  }, [text, voices, voiceURI, rate, pitch, supported])

  if (!supported) {
    return (
      <div className="rounded-xl border border-border bg-secondary/40 p-6 text-sm text-muted-foreground">
        Your browser does not support built-in speech synthesis. Try the Voice
        Clone tab, or use a Chromium-based browser.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Voice
          </span>
          <select
            value={voiceURI}
            onChange={(e) => setVoiceURI(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-5">
          <label className="space-y-2">
            <span className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Speed</span>
              <span className="font-mono text-foreground">{rate.toFixed(1)}x</span>
            </span>
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>

          <label className="space-y-2">
            <span className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>Pitch</span>
              <span className="font-mono text-foreground">{pitch.toFixed(1)}</span>
            </span>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>
        </div>
      </div>

      <div className="flex h-20 items-center justify-center rounded-xl border border-border bg-secondary/30 text-accent">
        <Waveform bars={56} active={speaking} className="h-12 w-full px-6" />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={speak}
          disabled={!text.trim()}
          className="h-12 flex-1 gap-2 text-base font-semibold"
        >
          <Play className="size-4" />
          Speak
        </Button>
        <Button
          onClick={stop}
          variant="secondary"
          disabled={!speaking}
          className="h-12 gap-2"
        >
          <Square className="size-4" />
          Stop
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Free mode uses your device&apos;s built-in voices and plays instantly in
        the browser. Available voices depend on your operating system.
      </p>
    </div>
  )
}
