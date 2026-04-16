import "./App.css"
import React, { useEffect, useState } from "react"
import { Dropdown } from "./components/Dropdown.tsx"
import { RaceDetails, type EventDetails } from "./components/RaceDetails.tsx"
import { SessionStandings, type DriverResult } from "./components/SessionStandings.tsx"

function App() {
  const years = Array.from({ length: new Date().getFullYear() - 2010 + 1 }, (_, i) => 2010 + i)
  const [schedule, setSchedule] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<number>(1)
  const [selectedEventName, setSelectedEventName] = useState<string>()
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)

  const [activeSession, setActiveSession] = useState<string | undefined>()
  const [sessionStandings, setSessionStandings] = useState<DriverResult[] | null>(null)
  const [standingsLoading, setStandingsLoading] = useState(false)
  const [standingsError, setStandingsError] = useState<string | null>(null)

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value))
    setSelectedEventName(undefined)
    setSelectedRoundNumber(1)
    setEventDetails(null)
    setActiveSession(undefined)
    setSessionStandings(null)
    setStandingsError(null)
  }

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const eventName = event.target.value
    setSelectedEventName(eventName)
    setSelectedRoundNumber(schedule.indexOf(eventName) + 1)
    setActiveSession(undefined)
    setSessionStandings(null)
    setStandingsError(null)
  }

  const handleSessionClick = async (sessionName: string) => {
    if (activeSession === sessionName) {
      // Toggle off if already viewing
      setActiveSession(undefined)
      setSessionStandings(null)
      setStandingsError(null)
      return
    }

    setActiveSession(sessionName)
    setSessionStandings(null)
    setStandingsError(null)
    setStandingsLoading(true)

    try {
      const encodedSession = encodeURIComponent(sessionName)
      const response = await fetch(
        `http://localhost:8000/session/${selectedYear}/${selectedRoundNumber}/${encodedSession}`
      )

      if (!response.ok) {
        setStandingsError(`Could not load results for ${sessionName}.`)
        setStandingsLoading(false)
        return
      }

      const data = await response.json()
      setSessionStandings(data.results)
    } catch (err) {
      setStandingsError(`Error fetching session results: ${err}`)
    } finally {
      setStandingsLoading(false)
    }
  }

  const handleStandingsBack = () => {
    setActiveSession(undefined)
    setSessionStandings(null)
    setStandingsError(null)
  }

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8000/schedule/${selectedYear}`, {})

        if (!response.ok) {
          console.error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        setSchedule(data.event_names)
        setSelectedEventName(data.event_names[0])
      } catch (err) {
        console.error(`Error fetching events: ${err}`)
      }
    }

    void loadEvents()
  }, [selectedYear])

  useEffect(() => {
    if (!selectedEventName) return

    const loadEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/event/${selectedYear}/${selectedRoundNumber}`,
          {}
        )

        if (!response.ok) {
          console.error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        setEventDetails(data)
      } catch (err) {
        console.error(`Error fetching event: ${err}`)
      }
    }

    void loadEvent()
  }, [selectedEventName, selectedYear, selectedRoundNumber])

  return (
    <div className="app-container">
      <header>
        <h1 style={{ color: "var(--accent)", textTransform: "uppercase" }}>F1 Live Schedule</h1>
      </header>
      <div className="selectors">
        <Dropdown label={"Select Year"} value={selectedYear} onChange={handleYearChange} options={years} />
        <Dropdown
          label={"Select Grand Prix"}
          value={selectedEventName}
          onChange={handleEventChange}
          options={schedule}
        />
      </div>

      {eventDetails && (
        <RaceDetails
          event={eventDetails}
          onSessionClick={handleSessionClick}
          activeSession={activeSession}
        />
      )}

      {standingsLoading && (
        <div className="standings-loading">
          <div className="loading-spinner" />
          <p>Loading session results…</p>
        </div>
      )}

      {standingsError && (
        <div className="standings-error">
          <p>{standingsError}</p>
          <button className="back-btn" onClick={handleStandingsBack}>Dismiss</button>
        </div>
      )}

      {sessionStandings && !standingsLoading && (
        <SessionStandings
          sessionName={activeSession!}
          results={sessionStandings}
          onBack={handleStandingsBack}
        />
      )}
    </div>
  )
}

export default App