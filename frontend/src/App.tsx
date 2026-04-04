import "./App.css"
import React, {useEffect, useState} from "react"
import {Dropdown} from "./components/Dropdown.tsx";
import {RaceDetails, type EventDetails} from "./components/RaceDetails.tsx";

function App() {
  const years = Array.from({length: new Date().getFullYear() - 2010 + 1}, (_, i) => 2010 + i)
  const [schedule, setSchedule] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<number>(1)
  const [selectedEventName, setSelectedEventName] = useState<string>()
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)


  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value))
    setSelectedEventName(undefined)
    setSelectedRoundNumber(1)
    setEventDetails(null)
  }

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const eventName = event.target.value
    setSelectedEventName(eventName)
    setSelectedRoundNumber(schedule.indexOf(eventName) + 1)
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
        const response = await fetch(`http://localhost:8000/event/${selectedYear}/${selectedRoundNumber}`, {})

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
  }, [selectedEventName, selectedYear, selectedRoundNumber]);

  return (
    <div className="app-container">
      <header>
        <h1 style={{color: 'var(--accent)', textTransform: 'uppercase'}}>F1 Live Schedule</h1>
      </header>
      <div className="selectors">
        <Dropdown label={"Select Year"} value={selectedYear} onChange={handleYearChange} options={years}/>
        <Dropdown label={"Select Grand Prix"} value={selectedEventName} onChange={handleEventChange} options={schedule}/>
      </div>
      {eventDetails && <RaceDetails event={eventDetails} />}
    </div>
  )
}

export default App