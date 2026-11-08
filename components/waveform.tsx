'use client'

import { cn } from '@/lib/utils'

type WaveformProps = {
  bars?: number
  active?: boolean
  className?: string
  barClassName?: string
}

// Deterministic pseudo-random heights so SSR and client match.
const SEED = [0.9, 0.4, 0.75, 0.55, 1, 0.35, 0.65, 0.85, 0.45, 0.95, 0.6, 0.8]

export function Waveform({
  bars = 36,
  active = false,
  className,
  barClassName,
}: WaveformProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-[3px]', className)}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const base = SEED[i % SEED.length]
        return (
          <span
            key={i}
            className={cn(
              'w-[3px] rounded-full bg-current transition-[height,opacity] duration-300',
              barClassName,
            )}
            style={{
              height: `${Math.round(base * 100)}%`,
              opacity: active ? 1 : 0.35,
              transformOrigin: 'center',
              animation: active
                ? `eq-bounce ${0.7 + (i % 5) * 0.18}s ease-in-out ${(i % 7) * 0.08}s infinite`
                : undefined,
            }}
          />
        )
      })}
    </div>
  )
}
