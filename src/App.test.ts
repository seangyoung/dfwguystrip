import { describe, expect, it } from 'vitest'
import { activities, candidateDates, itineraries } from './types'

describe('seed trip content', () => {
  it('keeps Andretti as an alternate', () => {
    expect(activities.find(activity => activity.id === 'andretti')?.tier).toBe('alternate')
  })

  it('includes the State Fair as a date-bound flagship option', () => {
    const fair = activities.find(activity => activity.id === 'state-fair')
    expect(fair?.tier).toBe('flagship')
    expect(fair?.seasonal).toContain('September 25-October 18, 2026')
  })

  it('models Zero-G and skydiving as an either-or slot', () => {
    expect(itineraries.find(itinerary => itinerary.id === 'premium')?.days[1].stops[0]).toMatch(/Zero-G OR Skydiving/)
  })

  it('provides distinct candidate dates across multiple months', () => {
    expect(candidateDates).toHaveLength(9)
    expect(new Set(candidateDates.map(date => date.slice(0, 7))).size).toBeGreaterThan(1)
  })
})
