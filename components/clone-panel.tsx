'use client'

import { useCallback, useRef, useState } from 'react'
import {
  AlertCircle,
  Loader2,
  Mic,
  Sparkles,
  Square,
  Upload,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Waveform } from '@/components/waveform'
import { AudioPlayer } from '@/components/audio-player'
import { cn } from '@/lib/utils'

export function ClonePanel({ text }: { text: string }) {
  const [sample, setSample] = useState<{ file: File; url: string } | null>(null)
  const [refText, setRefText] = useState('')
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const setFile = useCallback((file: File) => {
    setError(null)
    setResultUrl(null)
    setSample((prev) => {
      if (prev) URL.revokeObjectURL(prev.url)
      return { file, url: URL.createObjectURL(file) }
    })
  }, [])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('audio')) setFile(file)
    else if (file) setError('Please drop an audio file (.wav or .mp3).')
  }

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' })
        setFile(file)
        stream.getTracks().forEach((t) => t.stop())
      }
      recorder.start()
      recorderRef.current = recorder
      setRecording(true)
    } catch {
      setError('Microphone access was blocked. Upload a file instead.')
    }
  }

  const stopRecording = () => {
    recorderRef.current?.stop()
    setRecording(false)
  }

  const generate = async () => {
    if (!sample || !text.trim()) return
    setLoading(true)
    setError(null)
    setResultUrl(null)
    try {
      const form = new FormData()
      form.append('audio', sample.file)
      form.append('text', text.trim())
      if (refText.trim()) form.append('refText', refText.trim())

      const res = await fetch('/api/clone-voice', {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to generate speech.')
      setResultUrl(data.audioUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const clearSample = () => {
    if (sample) URL.revokeObjectURL(sample.url)
    setSample(null)
    setResultUrl(null)
  }

  return (
    <div className="space-y-6">
      {!sample ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors',
            dragging
              ? 'border-primary bg-primary/10'
              : 'border-border bg-secondary/30 hover:border-primary/60 hover:bg-secondary/50',
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Upload className="size-5" />
          </div>
          <div>
            <p className="font-medium">Drop a voice sample or click to upload</p>
            <p className="text-sm text-muted-foreground">
              .wav or .mp3 — 10-30 seconds of clear speech works best
            </p>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-px w-8 bg-border" /> or{' '}
            <span className="h-px w-8 bg-border" />
          </div>
          <Button
            type="button"
            variant={recording ? 'destructive' : 'secondary'}
            size="sm"
            className="gap-2"
            onClick={(e) => {
              e.stopPropagation()
              recording ? stopRecording() : startRecording()
            }}
          >
            {recording ? (
              <>
                <Square className="size-4" /> Stop recording
              </>
            ) : (
              <>
                <Mic className="size-4" /> Record with mic
              </>
            )}
          </Button>
          {recording && (
            <div className="text-accent">
              <Waveform bars={32} active className="h-8 w-40" />
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,.wav,.mp3"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setFile(file)
            }}
          />
        </div>
      ) : (
        <div className="space-y-4 rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Mic className="size-4" />
              </div>
              <p className="truncate text-sm font-medium">{sample.file.name}</p>
            </div>
            <button
              type="button"
              onClick={clearSample}
              aria-label="Remove sample"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <audio src={sample.url} controls className="w-full" />

          <label className="block space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Transcript of the sample (optional, improves accuracy)
            </span>
            <input
              value={refText}
              onChange={(e) => setRefText(e.target.value)}
              placeholder="What is said in the uploaded audio…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
          </label>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex h-20 items-center justify-center rounded-xl border border-border bg-secondary/30 text-primary">
          <Waveform bars={56} active className="h-12 w-full px-6" />
        </div>
      )}

      {resultUrl && !loading && (
        <div className="animate-float-up space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Generated speech
          </p>
          <AudioPlayer src={resultUrl} />
        </div>
      )}

      <Button
        onClick={generate}
        disabled={!sample || !text.trim() || loading}
        className="h-12 w-full gap-2 text-base font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Cloning voice…
          </>
        ) : (
          <>
            <Sparkles className="size-4" /> Generate in this voice
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Clone mode uses an AI model (via fal) to match your uploaded voice. The
        result is downloadable. Only upload voices you have permission to use.
      </p>
    </div>
  )
}
