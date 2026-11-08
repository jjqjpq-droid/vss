import { Mic, Zap } from 'lucide-react'
import { VoiceCloner } from '@/components/voice-cloner'
import { Waveform } from '@/components/waveform'

export default function Page() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-studio-grid">
      <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 py-10 sm:py-16">
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            Free browser voices · Optional AI cloning
          </div>

          <div className="mb-5 flex h-10 text-primary">
            <Waveform bars={24} active className="h-full w-44" />
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Turn text into a{' '}
            <span className="text-primary">speaking voice</span>
          </h1>
          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Type anything and hear it spoken. Use your device&apos;s free voices
            instantly, or upload a sample to clone a specific voice.
          </p>
        </header>

        <VoiceCloner />

        <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Feature
            icon={<Zap className="size-4" />}
            title="Instant & free"
            desc="Browser voices, no sign-up or keys."
          />
          <Feature
            icon={<Fingerprint />}
            title="Voice cloning"
            desc="Match an uploaded voice sample."
          />
          <Feature
            icon={<Mic className="size-4" />}
            title="Record or upload"
            desc="Use a .wav/.mp3 or your mic."
          />
        </section>

        <footer className="mt-auto pt-10 text-center text-xs text-muted-foreground">
          <p>Built on Vercel</p>
          <p className="mt-1">
            Only clone voices you have permission to use.
          </p>
        </footer>
      </div>
    </main>
  )
}

function Fingerprint() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
      <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
      <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
      <path d="M8.65 22c.21-.66.45-1.32.57-2" />
      <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
      <path d="M2 16h.01" />
      <path d="M21.8 16c.2-2 .131-5.354 0-6" />
      <path d="M12 6a6 6 0 0 1 6 6v2" />
    </svg>
  )
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4 backdrop-blur-sm">
      <div className="mb-2 flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
        {desc}
      </p>
    </div>
  )
}
