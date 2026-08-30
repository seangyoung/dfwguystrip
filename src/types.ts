export type ActivityTier = 'flagship' | 'alternate'
export type Availability = 'available' | 'maybe' | 'unavailable'

export interface Activity {
  id: string
  name: string
  category: string
  tier: ActivityTier
  estimate: string
  restriction: string
  seasonal: string
  sourceUrl: string
  note: string
}

export interface Itinerary {
  id: string
  name: string
  subtitle: string
  estimatedCost: string
  theme: string
  days: { label: string; stops: string[] }[]
}

export const activities: Activity[] = [
  { id: 'zero-g', name: 'Zero-G OR Skydiving', category: 'Bucket-list adrenaline', tier: 'flagship', estimate: '$299+ skydiving / Zero-G varies', restriction: 'Zero-G is a flight-specific booking; skydiving has age, weight, and medical requirements.', seasonal: 'Weather affects skydiving. Zero-G dates are limited.', sourceUrl: 'https://www.gozerog.com/', note: 'Mutually exclusive headline slot. Participants can choose their preferred option.' },
  { id: 'speedway', name: 'Texas Motor Speedway driving experience', category: 'Motorsports', tier: 'flagship', estimate: 'Varies by package', restriction: 'Driver age/license, waiver, and package rules apply.', seasonal: 'Schedule-dependent.', sourceUrl: 'https://www.texasmotorspeedway.com/', note: 'A high-energy alternative for the group.' },
  { id: 'six-flags', name: 'Six Flags Over Texas', category: 'Theme park', tier: 'flagship', estimate: 'Estimate: $45-$120', restriction: 'Ride restrictions apply.', seasonal: 'Best in spring/fall; check event calendar.', sourceUrl: 'https://www.sixflags.com/overtexas', note: 'Full-day option with varied intensity levels.' },
  { id: 'state-fair', name: 'State Fair of Texas + Texas Auto Show', category: 'Seasonal Texas event', tier: 'flagship', estimate: 'Admission: $7-$25; Estimate: $60-$150 all-in', restriction: 'Food, Midway rides, and parking are additional. Plan a full day and use DART or carpool for easier logistics.', seasonal: 'September 25-October 18, 2026 only. Future dates and pricing must be rechecked.', sourceUrl: 'https://bigtex.com/faq/', note: 'Big Tex, fair food, 100+ included attractions, 70 Midway rides, and the Texas Auto Show in one Texas-scale day.' },
  { id: 'stockyards', name: 'Fort Worth Stockyards + rodeo', category: 'Texas original', tier: 'flagship', estimate: 'Estimate: $30-$100', restriction: 'Rodeo ticketing and show dates vary.', seasonal: 'Year-round; rodeo schedule varies.', sourceUrl: 'https://www.fortworthstockyards.com/', note: 'Cattle drive, historic district, and a Texas-scale evening.' },
  { id: 'gun-experience', name: 'Texas Gun Experience', category: 'Shooting experience', tier: 'flagship', estimate: 'Varies by firearm/package', restriction: 'Government ID, waivers, safety rules, and range eligibility apply.', seasonal: 'Year-round indoor.', sourceUrl: 'https://texasgunexperience.com/', note: 'A step up from a standard pistol-range outing.' },
  { id: 'meow-wolf', name: 'Meow Wolf Grapevine', category: 'Immersive experience', tier: 'flagship', estimate: 'Estimate: $35-$55', restriction: 'Timed entry recommended.', seasonal: 'Year-round indoor.', sourceUrl: 'https://meowwolf.com/visit/grapevine', note: 'A surreal, interactive indoor reset between bigger events.' },
  { id: 'medieval-times', name: 'Medieval Times', category: 'Dinner show', tier: 'flagship', estimate: 'Estimate: $70-$100', restriction: 'Advance group reservations advised.', seasonal: 'Year-round; performance schedule varies.', sourceUrl: 'https://www.medievaltimes.com/plan-your-trip/dallas-tx', note: 'A dinner-and-show anchor with zero nightlife dependency.' },
  { id: 'andretti', name: 'Andretti Indoor Karting & Games', category: 'Indoor competition', tier: 'alternate', estimate: 'Varies by attraction', restriction: 'Attraction height/age rules apply.', seasonal: 'Year-round indoor.', sourceUrl: 'https://www.andrettikarting.com/', note: 'Alternate only, not a flagship activity.' },
  { id: 'fossil-rim', name: 'Fossil Rim Wildlife Center', category: 'Outdoor Texas', tier: 'alternate', estimate: 'Estimate: $30-$40', restriction: 'Vehicle and reservation policies apply.', seasonal: 'Most comfortable in cooler weather.', sourceUrl: 'https://fossilrim.org/', note: 'An unusual day trip for the outdoors-oriented itinerary.' },
]

export const itineraries: Itinerary[] = [
  { id: 'premium', name: 'Premium Split Adventure', subtitle: 'Bucket-list centerpiece, games, and Texas history.', estimatedCost: 'Estimate: $500-$1,500+ before lodging', theme: 'Big swing / premium', days: [
    { label: 'Day 1', stops: ['National Videogame Museum', 'Game-show-style team competition', 'Dinner at Puttery'] },
    { label: 'Day 2', stops: ['Zero-G OR Skydiving', 'Medieval Times dinner show'] },
    { label: 'Day 3', stops: ['Bureau of Engraving and Printing', 'Stockyards cattle drive', 'Fort Worth rodeo'] },
  ] },
  { id: 'adrenaline', name: 'Shared Adrenaline + Firepower', subtitle: 'A high-energy weekend with a Texas finish.', estimatedCost: 'Estimate: $350-$900 before lodging', theme: 'High shared intensity', days: [
    { label: 'Day 1', stops: ['Six Flags Over Texas', 'Coyote Drive-In'] },
    { label: 'Day 2', stops: ['Skydiving', 'Texas Gun Experience'] },
    { label: 'Day 3', stops: ['Bureau of Engraving and Printing', 'Stockyards and rodeo'] },
  ] },
  { id: 'outdoor', name: 'Outdoor Texas Weekend', subtitle: 'Lake time, trail time, horses, and a flexible closer.', estimatedCost: 'Estimate: $250-$600 before lodging', theme: 'Outdoor / lower logistics', days: [
    { label: 'Day 1', stops: ['Fort Worth Nature Center hike', 'Stockyard Stables horseback ride', 'Fort Worth rodeo'] },
    { label: 'Day 2', stops: ['Lewisville Lake jet skis or tritoon', 'Coyote Drive-In'] },
    { label: 'Day 3', stops: ['BEP + National Videogame Museum OR Texas Gun Experience'] },
  ] },
]

export const candidateDates = ['2026-09-18', '2026-09-19', '2026-09-20', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-16', '2026-10-17', '2026-10-18']
