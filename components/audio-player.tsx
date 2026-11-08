'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Waveform } from '@/components/waveform'

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function AudioPlayer({
  src,
  downloadName = 'vocalis-speech.wav',
}: {
  src: string
  downloadName?: string
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    setPlaying(false)
    setCurrent(0)
  }, [src])

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (el.paused) {
      void el.play()
    } else {
      el.pause()
    }
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0

  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <audio
        ref={audioRef}
        src={src}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          {playing ? (
            <Pause className="size-5" />
          ) : (
            <Play className="size-5 translate-x-[1px]" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-2 h-10 text-accent">
            <Waveform bars={48} active={playing} className="h-full" />
          </div>
          <div className="flex items-center gap-3">
            <div
              className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
            >
              <div
                className={cn(
                  'absolute inset-y-0 left-0 rounded-full bg-primary',
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
              {formatTime(current)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        <a
          href={src}
          download={downloadName}
          aria-label="Download audio"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
        >
          <Download className="size-4" />
        </a>
      </div>
    </div>
  )
}
