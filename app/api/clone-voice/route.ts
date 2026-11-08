import { type NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'

fal.config({
  credentials: process.env.FAL_KEY,
})

export const maxDuration = 120

const MAX_AUDIO_BYTES = 25 * 1024 * 1024 // 25 MB
const MAX_TEXT_LENGTH = 1000

export async function POST(request: NextRequest) {
  try {
    if (!process.env.FAL_KEY) {
      return NextResponse.json(
        { error: 'Voice engine is not configured.' },
        { status: 500 },
      )
    }

    const formData = await request.formData()
    const audio = formData.get('audio')
    const text = formData.get('text')
    const refText = formData.get('refText')

    if (!(audio instanceof File)) {
      return NextResponse.json(
        { error: 'Please upload a voice sample (.wav or .mp3).' },
        { status: 400 },
      )
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { error: 'Voice sample is too large. Keep it under 25 MB.' },
        { status: 400 },
      )
    }

    if (typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please enter some text to speak.' },
        { status: 400 },
      )
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Text must be ${MAX_TEXT_LENGTH} characters or fewer.` },
        { status: 400 },
      )
    }

    // Upload the reference voice sample to fal storage to get a public URL.
    const refAudioUrl = await fal.storage.upload(audio)

    const result = await fal.subscribe('fal-ai/f5-tts', {
      input: {
        gen_text: text.trim(),
        ref_audio_url: refAudioUrl,
        model_type: 'F5-TTS',
        remove_silence: true,
        ...(typeof refText === 'string' && refText.trim().length > 0
          ? { ref_text: refText.trim() }
          : {}),
      },
    })

    const audioUrl = result.data?.audio_url?.url ?? result.data?.audio_url

    if (!audioUrl || typeof audioUrl !== 'string') {
      throw new Error('No audio returned from the voice engine.')
    }

    return NextResponse.json({ audioUrl })
  } catch (error) {
    console.error('[v0] clone-voice error:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to generate speech.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
