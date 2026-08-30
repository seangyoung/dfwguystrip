import { FormEvent, useEffect, useMemo, useState } from 'react'
import { activities, candidateDates, itineraries, type Activity, type Availability } from './types'
import { hasSupabase, isCoordinator, supabase } from './supabase'

type View = 'home' | 'activities' | 'dining' | 'itineraries' | 'vote' | 'calendar' | 'admin'
type SessionUser = { email: string; id: string } | null

const nav: { id: View; label: string }[] = [
  { id: 'home', label: 'Trip Brief' }, { id: 'activities', label: 'Activities' },
  { id: 'dining', label: 'Dining' },
  { id: 'itineraries', label: 'Itineraries' }, { id: 'vote', label: 'Vote' }, { id: 'calendar', label: 'Calendar' },
]

const availabilityLabels: Record<Availability, string> = { available: 'Available', maybe: 'Maybe', unavailable: 'Unavailable' }
const diningCategories = new Set(['Dinner show', 'Flagship dining', 'Texas dining', 'Budget dining', 'Food tour'])
const isDining = (activity: Activity) => diningCategories.has(activity.category)

function photoFor(activity: Activity) {
  if (isDining(activity)) return 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80'
  if (['helicopter-tour', 'reunion-tower'].includes(activity.id)) return 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80'
  if (['mountain-bike', 'go-ape', 'fossil-rim'].includes(activity.id)) return 'https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=900&q=80'
  if (['sixth-floor', 'att-stadium-tour', 'museum-illusions'].includes(activity.id)) return 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=900&q=80'
  if (['zero-g', 'ifly'].includes(activity.id)) return 'https://images.unsplash.com/photo-1532077795302-7c7a64d3d8af?auto=format&fit=crop&w=900&q=80'
  return 'https://images.unsplash.com/photo-1531219432768-9f540ce91ef3?auto=format&fit=crop&w=900&q=80'
}

function App() {
  const [view, setView] = useState<View>('home')
  const [user, setUser] = useState<SessionUser>(null)
  const [email, setEmail] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data.user ? { id: data.user.id, email: data.user.email ?? '' } : null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ? { id: session.user.id, email: session.user.email ?? '' } : null))
    return () => listener.subscription.unsubscribe()
  }, [])

  async function signIn(event: FormEvent) {
    event.preventDefault()
    if (!hasSupabase || !supabase) {
      setUser({ id: 'demo-user', email: email || 'guest@example.com' })
      setAuthMessage('Preview mode: you are signed in as a demo participant. Add Supabase settings to enable magic links.')
      return
    }
    const redirectTo = window.location.href.split('#')[0]
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
    setAuthMessage(error ? error.message : 'Check your email for a secure sign-in link.')
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setView('home')
  }

  const coordinator = isCoordinator(user?.email) || user?.email === 'organizer@example.com'
  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setView('home')} aria-label="DFW Guys Trip home"><span>DFW</span> Guys Trip <i>26</i></button>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">Menu</button>
      <nav className={menuOpen ? 'open' : ''}>{nav.map(item => <button className={view === item.id ? 'active' : ''} key={item.id} onClick={() => { setView(item.id); setMenuOpen(false) }}>{item.label}</button>)}{coordinator && <button className={view === 'admin' ? 'active admin-link' : 'admin-link'} onClick={() => { setView('admin'); setMenuOpen(false) }}>Coordinator</button>}</nav>
      {user ? <button className="account" onClick={signOut}>{user.email.split('@')[0]} <span>Sign out</span></button> : <button className="account" onClick={() => document.getElementById('sign-in')?.scrollIntoView({ behavior: 'smooth' })}>Participant sign in</button>}
    </header>
    <main>
      {view === 'home' && <Home user={user} email={email} setEmail={setEmail} authMessage={authMessage} signIn={signIn} setView={setView} />}
      {view === 'activities' && <Activities />}
      {view === 'dining' && <Dining />}
      {view === 'itineraries' && <Itineraries />}
      {view === 'vote' && <Vote user={user} />}
      {view === 'calendar' && <Calendar user={user} />}
      {view === 'admin' && coordinator && <Admin />}
    </main>
    <footer>DFW Guys Trip planning hub <span>•</span> estimates are planning figures, not reservations</footer>
  </div>
}

function Home({ user, email, setEmail, authMessage, signIn, setView }: { user: SessionUser; email: string; setEmail: (value: string) => void; authMessage: string; signIn: (event: FormEvent) => void; setView: (view: View) => void }) {
  return <>
    <section className="hero"><p className="eyebrow">THE 2026 DFW EDITION</p><h1>One legendary<br /><em>Texas weekend.</em></h1><p className="hero-copy">Big-ticket adventure, Texas-only stories, great food, and a plan everyone can actually agree on.</p><div className="hero-actions"><button className="primary" onClick={() => setView('itineraries')}>Explore the concepts</button><button className="text-button" onClick={() => setView('activities')}>Browse activities →</button></div><div className="hero-stamp"><b>6–10</b><span>good men<br />expected</span></div></section>
    <section className="notice"><span className="notice-mark">!</span><div><b>Planning stage: weighing dates and activities</b><p>No drinking, no gambling, no club scene. Just excellent company and an unusually good weekend.</p></div><div className="deadline"><span>Next decision</span><b>Pick dates & favorites</b><small>Before reservations open</small></div></section>
    <section className="section split-intro"><div><p className="eyebrow">THE SHORTLIST</p><h2>Choose your version of epic.</h2></div><p>We are looking for a memorable shared experience, not a packed tourist checklist. Your votes will help turn these concepts into one real trip.</p></section>
    <section className="concept-grid">{itineraries.map((item, index) => <article className={'concept c' + index} key={item.id}><p>{item.theme}</p><h3>{item.name}</h3><span>{item.subtitle}</span><button onClick={() => setView('itineraries')}>View itinerary</button></article>)}</section>
    {!user && <section id="sign-in" className="sign-in"><div><p className="eyebrow">PARTICIPANT ACCESS</p><h2>Bring your opinion.</h2><p>Sign in to rank your must-dos, flag no-thanks activities, and mark the dates you can make.</p></div><form onSubmit={signIn}><label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /><button className="primary" type="submit">Send me a sign-in link</button>{authMessage && <p className="form-note">{authMessage}</p>}</form></section>}
  </>
}

function Catalog({ dining }: { dining: boolean }) { const [filter, setFilter] = useState<'all' | 'flagship' | 'alternate'>('all'); const visible = activities.filter(a => isDining(a) === dining && (filter === 'all' || a.tier === filter))
  const heading = dining ? 'The meals worth planning around.' : 'The possible stories.'
  const eyebrow = dining ? 'DINING CATALOG' : 'ACTIVITY CATALOG'
  const lede = dining ? 'A standalone collection of special-occasion dinners, dinner shows, and food-forward experiences. Prices marked “Estimate” include only a planning approximation unless otherwise stated.' : 'Adventure, culture, competition, and landmark options. Cost figures marked “Estimate” are working planning numbers; follow each source link for current rules and prices before booking.'
  return <section className="section page"><p className="eyebrow">{eyebrow}</p><h1>{heading}</h1><p className="lede">{lede}</p><div className="filters">{(['all', 'flagship', 'alternate'] as const).map(f => <button key={f} className={filter === f ? 'selected' : ''} onClick={() => setFilter(f)}>{f === 'all' ? 'Everything' : f}</button>)}</div><div className="activity-grid">{visible.map(a => <article className="activity" key={a.id}><div className="activity-photo" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,28,20,.05), rgba(10,28,20,.64)), url(${photoFor(a)})` }}><span>{a.category}</span><b className={a.tier}>{a.tier}</b></div><div className="activity-content"><h2>{a.name}</h2><strong>{a.estimate}</strong><p>{a.note}</p><dl><div><dt>Requirements</dt><dd>{a.restriction}</dd></div><div><dt>Timing</dt><dd>{a.seasonal}</dd></div></dl><a href={a.sourceUrl} target="_blank" rel="noreferrer">Official source ↗</a></div></article>)}</div></section> }

function Activities() { return <Catalog dining={false} /> }
function Dining() { return <Catalog dining /> }

function Itineraries() { return <section className="section page"><p className="eyebrow">THREE SHAPES OF A WEEKEND</p><h1>Compare the routes.</h1><p className="lede">These are working concepts. We will choose one anchor experience, then refine around participant availability and real booking windows.</p><div className="itinerary-grid">{itineraries.map(item => <article className="itinerary" key={item.id}><div className="itinerary-head"><p>{item.theme}</p><h2>{item.name}</h2><strong>{item.estimatedCost}</strong></div>{item.days.map(day => <div className="day" key={day.label}><b>{day.label}</b><ul>{day.stops.map(stop => <li key={stop}>{stop}</li>)}</ul></div>)}<p className="itinerary-note">{item.id === 'premium' ? 'The Zero-G / skydiving slot is deliberately an either/or choice.' : item.subtitle}</p></article>)}</div></section> }

function Vote({ user }: { user: SessionUser }) { const [ranked, setRanked] = useState(['zero-g', 'stockyards', 'gun-experience']); const [avoid, setAvoid] = useState<string[]>([]); const [comment, setComment] = useState(''); const [saved, setSaved] = useState(false); const [saveError, setSaveError] = useState(''); const voteActivities = activities.filter(activity => !isDining(activity))
  if (!user) return <RequireSignIn title="Cast your vote" />
  const participant = user
  const move = (index: number, direction: number) => { const next = [...ranked]; const swap = index + direction; if (swap < 0 || swap >= next.length) return; [next[index], next[swap]] = [next[swap], next[index]]; setRanked(next) }
  const available = voteActivities.filter(a => !ranked.includes(a.id))
  async function saveBallot() { if (supabase && participant.id !== 'demo-user') { const { error: deleteError } = await supabase.from('activity_votes').delete().eq('profile_id', participant.id); if (deleteError) { setSaveError(deleteError.message); return } const rows = [...ranked.map((activityId, index) => ({ profile_id: participant.id, activity_id: activityId, rank: index + 1, would_avoid: false, comment: index === 0 ? comment || null : null })), ...avoid.filter(id => !ranked.includes(id)).map(activityId => ({ profile_id: participant.id, activity_id: activityId, rank: null, would_avoid: true, comment: null }))]; const { error } = await supabase.from('activity_votes').upsert(rows); if (error) { setSaveError(error.message); return } } setSaveError(''); setSaved(true) }
  return <section className="section page ballot"><p className="eyebrow">ACTIVITY PREFERENCE BALLOT</p><h1>What would make it great?</h1><p className="lede">Rank your top three activities. Then mark any you would rather sit out. Dining has its own catalog, so these votes stay focused on the experience anchors.</p><div className="ballot-grid"><div><h2>Your top three</h2>{ranked.map((id, index) => { const a = activities.find(activity => activity.id === id)!; return <div className="rank" key={id}><b>{index + 1}</b><span>{a.name}</span><button disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button disabled={index === ranked.length - 1} onClick={() => move(index, 1)}>↓</button></div> })}<select defaultValue="" onChange={event => { if (event.target.value && ranked.length < 3) setRanked([...ranked, event.target.value]); event.currentTarget.value = '' }}><option value="">Add an activity</option>{available.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div><div><h2>Would rather not</h2>{voteActivities.map(a => <label className="check" key={a.id}><input type="checkbox" checked={avoid.includes(a.id)} onChange={() => setAvoid(avoid.includes(a.id) ? avoid.filter(id => id !== a.id) : [...avoid, a.id])} />{a.name}</label>)}</div></div><label className="comment-label">Anything we should know?<textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Budget, mobility, an idea we missed, or anything else." /></label><button className="primary" onClick={saveBallot}>Save my ballot</button>{saved && <p className="saved">{supabase ? 'Your ballot is saved.' : 'Saved locally for this preview.'}</p>}{saveError && <p className="error">Could not save: {saveError}</p>}</section> }

function Calendar({ user }: { user: SessionUser }) { const [entries, setEntries] = useState<Record<string, Availability>>({ '2026-09-18': 'available', '2026-09-19': 'available', '2026-09-20': 'maybe' }); const [saved, setSaved] = useState(false); const [month, setMonth] = useState(8); const [saveError, setSaveError] = useState('')
  if (!user) return <RequireSignIn title="Mark your availability" />
  const participant = user
  const year = 2026; const first = new Date(Date.UTC(year, month, 1)); const leading = first.getUTCDay(); const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate(); const cells = Array.from({ length: leading + days }, (_, i) => i < leading ? null : i - leading + 1)
  const dateString = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const cycle = (date: string) => { const order: Availability[] = ['available', 'maybe', 'unavailable']; setEntries({ ...entries, [date]: order[(order.indexOf(entries[date] ?? 'unavailable') + 1) % order.length] }) }
  async function saveAvailability() { if (supabase && participant.id !== 'demo-user') { const rows = candidateDates.map(day => ({ profile_id: participant.id, day, status: entries[day] ?? 'unavailable' })); const { error } = await supabase.from('availability_responses').upsert(rows); if (error) { setSaveError(error.message); return } } setSaveError(''); setSaved(true) }
  return <section className="section page calendar-page"><p className="eyebrow">DATE AVAILABILITY</p><h1>Show us your calendar.</h1><p className="lede">Tap each candidate date to cycle through available, maybe, and unavailable. We will use the overlap to identify the real contenders.</p><div className="availability-key">{(['available', 'maybe', 'unavailable'] as Availability[]).map(status => <span className={status} key={status}>{availabilityLabels[status]}</span>)}</div><div className="calendar-card"><div className="month-nav"><button onClick={() => setMonth(Math.max(8, month - 1))} disabled={month === 8}>←</button><h2>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first)}</h2><button onClick={() => setMonth(Math.min(9, month + 1))} disabled={month === 9}>→</button></div><div className="weekdays">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => <span key={day}>{day}</span>)}</div><div className="dates">{cells.map((day, i) => { if (!day) return <span key={'blank' + i} />; const date = dateString(day); const candidate = candidateDates.includes(date); return <button key={date} disabled={!candidate} className={candidate ? entries[date] ?? 'unavailable' : 'empty'} onClick={() => cycle(date)}><b>{day}</b>{candidate && <small>{availabilityLabels[entries[date] ?? 'unavailable']}</small>}</button> })}</div></div><div className="response-summary"><h2>Your response</h2>{(['available', 'maybe', 'unavailable'] as Availability[]).map(status => <p key={status}><span className={status}></span><b>{Object.values(entries).filter(value => value === status).length}</b> {availabilityLabels[status].toLowerCase()} dates</p>)}</div><button className="primary" onClick={saveAvailability}>Save availability</button>{saved && <p className="saved">{supabase ? 'Your availability is saved.' : 'Saved locally for this preview.'}</p>}{saveError && <p className="error">Could not save: {saveError}</p>}</section> }

function RequireSignIn({ title }: { title: string }) { return <section className="section page empty-state"><p className="eyebrow">PARTICIPANT ACCESS</p><h1>{title}.</h1><p>Sign in from the Trip Brief page to add your response.</p></section> }

function Admin() { const [notice, setNotice] = useState('Planning stage: weighing dates and activities'); const [saved, setSaved] = useState(false); const summary = useMemo(() => [{ date: 'Sep 18', available: 7, maybe: 1 }, { date: 'Oct 3', available: 6, maybe: 2 }, { date: 'Oct 17', available: 5, maybe: 3 }], [])
  function exportCsv() { const rows = ['Date,Available,Maybe', ...summary.map(row => `${row.date},${row.available},${row.maybe}`)]; const url = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' })); const link = document.createElement('a'); link.href = url; link.download = 'dfw-trip-availability-summary.csv'; link.click(); URL.revokeObjectURL(url) }
  return <section className="section page admin"><p className="eyebrow">COORDINATOR VIEW</p><h1>Keep the group moving.</h1><div className="admin-grid"><article><h2>Planning notice</h2><textarea value={notice} onChange={e => setNotice(e.target.value)} /><button className="primary" onClick={() => setSaved(true)}>Publish notice</button>{saved && <p className="saved">Saved in preview mode. Connect Supabase to publish for all participants.</p>}</article><article><h2>Date snapshot</h2>{summary.map(row => <div className="date-row" key={row.date}><b>{row.date}</b><span>{row.available} available</span><span>{row.maybe} maybe</span></div>)}<button className="secondary" onClick={exportCsv}>Export CSV</button></article></div><article className="editor"><div><h2>Trip content</h2><p>Activities: {activities.filter(activity => !isDining(activity)).length} · Dining: {activities.filter(isDining).length} · Itineraries: {itineraries.length} · Candidate dates: {candidateDates.length}</p></div><button className="secondary">Manage catalog in Supabase</button></article><p className="admin-hint">The production schema includes activities, itineraries, dates, votes, availability, announcements, profiles, and access controls. This preview keeps the shared data in the app until Supabase is connected.</p></section> }

export default App
