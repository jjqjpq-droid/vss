'use client'

import { useState } from 'react'
import { AudioLines, Fingerprint } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FreeTtsPanel } from '@/components/free-tts-panel'
import { ClonePanel } from '@/components/clone-panel'

const MAX_TEXT = 1000

type Mode = 'free' | 'clone'

export function VoiceCloner() {
  const [mode, setMode] = useState<Mode>('free')
  const [text, setText] = useState('')

  return (
    <div className="w-full rounded-2xl border border-border bg-card/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-7">
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-secondary/50 p-1">
        <TabButton
          active={mode === 'free'}
          onClick={() => setMode('free')}
          icon={<AudioLines className="size-4" />}
          title="Free voices"
          subtitle="No keys · instant"
        />
        <TabButton
          active={mode === 'clone'}
          onClick={() => setMode('clone')}
          icon={<Fingerprint className="size-4" />}
          title="Clone a voice"
          subtitle="Match a sample"
        />
      </div>

      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="tts-text"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Text to speak
          </label>
          <span
            className={cn(
              'font-mono text-xs tabular-nums',
              text.length > MAX_TEXT
                ? 'text-destructive'
                : 'text-muted-foreground',
            )}
          >
            {text.length}/{MAX_TEXT}
          </span>
        </div>
        <textarea
          id="tts-text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
          placeholder="Type anything you want to hear spoken aloud…"
          rows={4}
          className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-base leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      {mode === 'free' ? (
        <FreeTtsPanel text={text} />
      ) : (
        <ClonePanel text={text} />
      )}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-all',
        active
          ? 'bg-background shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
          active
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-muted-foreground',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {subtitle}
        </span>
      </span>
    </button>
  )
}
