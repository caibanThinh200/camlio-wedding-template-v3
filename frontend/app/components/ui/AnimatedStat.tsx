'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  value: string
  from?: number
  duration?: number
}

function parse(value: string) {
  const match = value.match(/^(\d+\.?\d*)(.*)/)
  if (!match) return null
  const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0
  return { target: parseFloat(match[1]), suffix: match[2], decimals }
}

export default function AnimatedStat({ value, from = 0, duration = 2000 }: Props) {
  const parsed = parse(value)
  const target = parsed?.target ?? 0
  const suffix = parsed?.suffix ?? ''
  const decimals = parsed?.decimals ?? 0

  const [display, setDisplay] = useState(from.toFixed(decimals))
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!parsed) return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        observer.disconnect()

        const startTime = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
          setDisplay((from + (target - from) * eased).toFixed(decimals))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [from, target, duration, decimals, parsed])

  if (!parsed) return <span>{value}</span>

  return <span ref={ref}>{display}{suffix}</span>
}
