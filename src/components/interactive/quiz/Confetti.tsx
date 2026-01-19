'use client'

import { useEffect, useState, useCallback } from 'react'
import { CONFETTI_DURATION } from './constants'
import type { ConfettiProps } from './types'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
}

const COLORS = [
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#3b82f6', // blue
  '#22c55e', // green
  '#eab308', // yellow
  '#f97316', // orange
]

const PARTICLE_COUNT = 100

export function Confetti({ active, duration = CONFETTI_DURATION }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 6,
        speedX: (Math.random() - 0.5) * 3,
        speedY: 2 + Math.random() * 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }
    return newParticles
  }, [])

  useEffect(() => {
    if (active) {
      setIsVisible(true)
      setParticles(createParticles())

      const hideTimeout = setTimeout(() => {
        setIsVisible(false)
        setParticles([])
      }, duration)

      return () => clearTimeout(hideTimeout)
    }
  }, [active, duration, createParticles])

  useEffect(() => {
    if (!isVisible || particles.length === 0) return

    const animationFrame = requestAnimationFrame(function animate() {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            rotation: p.rotation + p.rotationSpeed,
            speedY: p.speedY + 0.1,
          }))
          .filter((p) => p.y < 120)
      )

      if (isVisible) {
        requestAnimationFrame(animate)
      }
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, particles.length])

  if (!isVisible || particles.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
      data-testid="confetti"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}
