import { useState, useEffect } from 'react'

interface RateLimitConfig {
    maxAttempts: number
    windowMs: number
    blockDurationMs: number
}

interface RateLimitState {
    attempts: number
    blockedUntil: number | null
}

export function useRateLimit(key: string, config: RateLimitConfig) {
    const [state, setState] = useState<RateLimitState>({
        attempts: 0,
        blockedUntil: null
    })

    // Load persisted state on mount
    useEffect(() => {
        const stored = localStorage.getItem(`ratelimit_${key}`)
        if (stored) {
            try {
                const data: RateLimitState = JSON.parse(stored)
                if (data.blockedUntil && data.blockedUntil > Date.now()) {
                    setState(data)
                } else {
                    // Clear expired block
                    localStorage.removeItem(`ratelimit_${key}`)
                }
            } catch {
                localStorage.removeItem(`ratelimit_${key}`)
            }
        }
    }, [key])

    // Check if currently blocked
    const isBlocked = state.blockedUntil !== null && state.blockedUntil > Date.now()

    // Record a failed attempt
    const recordAttempt = () => {
        const newAttempts = state.attempts + 1

        if (newAttempts >= config.maxAttempts) {
            const blockUntil = Date.now() + config.blockDurationMs
            const newState = {
                attempts: newAttempts,
                blockedUntil: blockUntil
            }
            setState(newState)
            localStorage.setItem(`ratelimit_${key}`, JSON.stringify(newState))
        } else {
            setState(prev => ({ ...prev, attempts: newAttempts }))

            // Reset attempts after window expires
            setTimeout(() => {
                setState(prev => ({ ...prev, attempts: 0 }))
            }, config.windowMs)
        }
    }

    // Reset rate limit (useful for successful attempts)
    const reset = () => {
        setState({ attempts: 0, blockedUntil: null })
        localStorage.removeItem(`ratelimit_${key}`)
    }

    // Calculate remaining block time in seconds
    const remainingTime = state.blockedUntil
        ? Math.ceil((state.blockedUntil - Date.now()) / 1000)
        : 0

    return {
        isBlocked,
        recordAttempt,
        reset,
        remainingTime,
        attempts: state.attempts
    }
}
