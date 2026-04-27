'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import ArrowLink from '@/app/components/ui/ArrowLink'
import Container from '@/app/components/ui/Container'
import ItalicHeading from '@/app/components/ui/ItalicHeading'

export type ExperienceBlockProps = {
  heading: string
  italicPhrase: string
  body: string
  ctaLabel: string
  ctaHref: string
  videoThumbnail?: string
  videoUrl: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|[?&]v=)([^?&#]+)/)
  return m ? m[1] : null
}

interface YTPlayerInstance {
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  getCurrentTime(): number
  getDuration(): number
  destroy(): void
}

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string
          width?: string | number
          height?: string | number
          playerVars?: Record<string, string | number>
          events?: {
            onReady?: (e: { target: YTPlayerInstance }) => void
            onStateChange?: (e: { data: number }) => void
          }
        }
      ) => YTPlayerInstance
      PlayerState: { ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

export default function ExperienceBlock({
  heading,
  italicPhrase,
  body,
  ctaLabel,
  ctaHref,
  videoThumbnail,
  videoUrl,
}: ExperienceBlockProps) {
  const ytWrapperRef = useRef<HTMLDivElement>(null)
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [showThumbnail, setShowThumbnail] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hoverRatio, setHoverRatio] = useState<number | null>(null)
  console.log(duration)
  const ytId = extractYouTubeId(videoUrl)
  const isYouTube = ytId !== null

  // For YouTube, auto-generate thumbnail from YT CDN if none provided
  const thumbnailSrc =
    videoThumbnail ??
    (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null)

  const progress = duration > 0 ? currentTime / duration : 0

  // ── YouTube IFrame API setup ──────────────────────────────────────────────
  useEffect(() => {
    if (!isYouTube || !ytId) return
    const wrapper = ytWrapperRef.current
    if (!wrapper) return

    // Create a div outside React's control for YT to replace with its iframe
    const ytDiv = document.createElement('div')
    ytDiv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'
    wrapper.appendChild(ytDiv)

    const initPlayer = () => {
      if (!ytDiv.parentElement) return
      ytPlayerRef.current = new window.YT.Player(ytDiv, {
        videoId: ytId,
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            const d = e.target.getDuration()
            if (d > 0) setDuration(d)
          },
          onStateChange: (e) => {
            if (e.data === 1) {
              setIsPlaying(true)
              setShowThumbnail(false)
            } else if (e.data === 2) {
              setIsPlaying(false)
            } else if (e.data === 0) {
              setIsPlaying(false)
              setCurrentTime(0)
              if (thumbnailSrc) setShowThumbnail(true)
            }
          },
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        initPlayer()
      }
      if (!document.getElementById('yt-iframe-api')) {
        const script = document.createElement('script')
        script.id = 'yt-iframe-api'
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
    }

    return () => {
      ytPlayerRef.current?.destroy()
      ytPlayerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYouTube, ytId])

  // Poll YT current time while playing
  useEffect(() => {
    if (!isYouTube || !isPlaying) return
    const id = setInterval(() => {
      const player = ytPlayerRef.current
      if (!player) return
      setCurrentTime(player.getCurrentTime())
      if (duration === 0) {
        const d = player.getDuration()
        if (d > 0) setDuration(d)
      }
    }, 250)
    return () => clearInterval(id)
  }, [isYouTube, isPlaying, duration])

  // ── MP4 handlers ─────────────────────────────────────────────────────────
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setCurrentTime(video.currentTime)
    // Grab duration here as a reliable fallback — fires on every frame while playing
    if (duration === 0) {
      const d = video.duration
      if (d && isFinite(d)) setDuration(d)
    }
  }, [duration])

  const handleLoadedMetadata = useCallback(() => {
    const d = videoRef.current?.duration
    if (d && isFinite(d)) setDuration(d)
  }, [])

  const handleDurationChange = useCallback(() => {
    const d = videoRef.current?.duration
    if (d && isFinite(d)) setDuration(d)
  }, [])

  const handleEnded = useCallback(() => {
    setIsPlaying(false)
    setCurrentTime(0)
  }, [])

  // ── Shared handlers ───────────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    if (isYouTube) {
      const player = ytPlayerRef.current
      if (!player) return
      if (isPlaying) {
        player.pauseVideo()
      } else {
        setShowThumbnail(false)
        player.playVideo()
      }
    } else {
      const video = videoRef.current
      if (!video) return
      if (isPlaying) {
        video.pause()
        setIsPlaying(false)
      } else {
        setShowThumbnail(false)
        video.play()
        setIsPlaying(true)
      }
    }
  }, [isYouTube, isPlaying])

  const getRatioFromEvent = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current
    if (!bar) return 0
    const rect = bar.getBoundingClientRect()
    return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  }, [])

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (duration === 0) return
      const ratio = getRatioFromEvent(e)
      const seekTime = ratio * duration
      if (isYouTube) {
        ytPlayerRef.current?.seekTo(seekTime, true)
        setCurrentTime(seekTime)
      } else {
        const video = videoRef.current
        if (!video) return
        video.currentTime = seekTime
        setCurrentTime(seekTime)
      }
    },
    [isYouTube, duration, getRatioFromEvent]
  )

  const handleProgressMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (duration === 0) return
      setHoverRatio(getRatioFromEvent(e))
    },
    [duration, getRatioFromEvent]
  )

  const handleProgressMouseLeave = useCallback(() => {
    setHoverRatio(null)
  }, [])

  return (
    <section className="bg-[var(--color-blush)] py-16 lg:py-[120px] flex flex-col gap-16 lg:gap-[100px] items-center">
      <Container className="flex flex-col gap-8 lg:gap-10 items-center text-center">
        <ItalicHeading
          text={heading}
          italicPart={italicPhrase}
          className="display-lg text-[var(--color-text)] max-w-full lg:max-w-[1018px]"
        />
        <p className="body-lg text-[var(--color-text)] opacity-50 whitespace-pre-line max-w-full lg:max-w-[1018px]">
          {body}
        </p>
        <ArrowLink href={ctaHref} label={ctaLabel} variant="filled-red" />
      </Container>

      <Container className="relative h-[240px] md:h-[400px] lg:h-[580px] overflow-hidden group">
        {/* YouTube wrapper — children managed imperatively by YT API */}
        {isYouTube && (
          <div
            ref={ytWrapperRef}
            className="absolute inset-0 w-full h-full"
            style={{ visibility: showThumbnail ? 'hidden' : 'visible' }}
          />
        )}

        {/* MP4 — preload="metadata" shows first frame as default poster */}
        {!isYouTube && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onDurationChange={handleDurationChange}
            onEnded={handleEnded}
            playsInline
            preload="metadata"
          />
        )}

        {/* Thumbnail overlay — YT auto-thumbnail or explicit image */}
        {showThumbnail && thumbnailSrc && (
          <Image
            src={thumbnailSrc}
            alt="Experience video thumbnail"
            fill
            className="object-cover"
            unoptimized={thumbnailSrc.startsWith('https://img.youtube.com')}
          />
        )}

        {/* Play / pause button */}
        <button
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className={[
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
            'size-16 md:size-[100px] flex items-center justify-center',
            'transition-opacity duration-200',
            !showThumbnail && isPlaying
              ? 'opacity-0 group-hover:opacity-100 focus:opacity-100'
              : 'opacity-100',
          ].join(' ')}
        >
          <div className="size-full rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer">
            {isPlaying ? (
              <svg width="20" height="24" viewBox="0 0 24 24" fill="none" className="md:w-8 md:h-8">
                <rect x="5" y="4" width="4" height="16" rx="1" fill="var(--color-red-mid)" />
                <rect x="15" y="4" width="4" height="16" rx="1" fill="var(--color-red-mid)" />
              </svg>
            ) : (
              <svg width="20" height="24" viewBox="0 0 32 36" fill="none" className="md:w-8 md:h-9">
                <path d="M0 0L32 18L0 36V0Z" fill="var(--color-red-mid)" />
              </svg>
            )}
          </div>
        </button>

        {/* Custom toolbar */}
        <div className="absolute bottom-3 left-4 right-4 md:bottom-5 md:left-10 md:right-10 flex flex-col gap-1.5">
          {/* Progress bar */}
          <div className="relative">
            {/* Hover time tooltip */}
            {hoverRatio !== null && duration > 0 && (
              <div
                className="absolute bottom-full mb-2 -translate-x-1/2 bg-black/75 text-white text-xs font-body font-bold px-2 py-0.5 rounded pointer-events-none whitespace-nowrap"
                style={{ left: `${hoverRatio * 100}%` }}
              >
                {formatTime(hoverRatio * duration)}
              </div>
            )}
            {/* Clickable hit area (taller than visual for easier interaction) */}
            <div
              ref={progressBarRef}
              role="slider"
              aria-valuenow={Math.round(progress * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              onClick={handleProgressClick}
              onMouseMove={handleProgressMouseMove}
              onMouseLeave={handleProgressMouseLeave}
              className="relative flex items-center w-full h-4 cursor-pointer"
            >
              {/* Visual track */}
              <div className="relative w-full h-1.5 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-white/50" />
                <div
                  className="absolute inset-y-0 left-0 bg-[#d77100]"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between font-body font-bold text-sm md:text-base text-white tracking-tight">
            <span>{formatTime(currentTime)}</span>
            <span className="text-right min-w-[2.75rem]">{duration > 0 ? formatTime(duration) : ''}</span>
          </div>
        </div>
      </Container>
    </section>
  )
}

