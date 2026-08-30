import { readFileSync } from 'node:fs'
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

  it('includes the approved seasonal and dining expansion', () => {
    const ids = activities.map(activity => activity.id)
    expect(ids).toEqual(expect.arrayContaining([
      'scarborough', 'mustang-magic', 'goodguys',
      'lonesome-dove', 'the-mexican', 'fearings', 'pappas-bros', 'cattlemens', 'whataburger',
    ]))
  })

  it('includes the new adventures, landmarks, and food tour', () => {
    const ids = activities.map(activity => activity.id)
    expect(ids).toEqual(expect.arrayContaining([
      'mountain-bike', 'helicopter-tour', 'ifly', 'activate', 'ebike-tour',
      'museum-illusions', 'sixth-floor', 'go-ape', 'att-stadium-tour', 'reunion-tower', 'uptown-eats',
    ]))
  })

  it('includes the latest participant-requested catalog additions', () => {
    const ids = activities.map(activity => activity.id)
    expect(ids).toEqual(expect.arrayContaining([
      'chapel-thanksgiving', 'national-videogame-museum', 'escape-game', 'katy-trail',
      'buc-ees', 'fowling', 'future-flight', 'horseback', 'smash-n-bash', 'summit-climbing',
      'moviehouse-eatery',
    ]))
    expect(ids).not.toContain('public-school-214')
  })

  it('models Zero-G and skydiving as an either-or slot', () => {
    expect(itineraries.find(itinerary => itinerary.id === 'premium')?.days[1].stops[0]).toMatch(/Zero-G OR Skydiving/)
  })

  it('provides distinct candidate dates across multiple months', () => {
    expect(candidateDates).toHaveLength(9)
    expect(new Set(candidateDates.map(date => date.slice(0, 7))).size).toBeGreaterThan(1)
  })

  it('has no duplicate activity IDs for Supabase vote seeding', () => {
    const ids = activities.map(activity => activity.id)
    expect(new Set(ids)).toHaveLength(ids.length)
  })

  it('seeds every activity ID that a participant can vote for', () => {
    const seed = readFileSync('supabase/seed.sql', 'utf8')
    for (const activity of activities) expect(seed).toContain(`'${activity.id}'`)
  })
})
