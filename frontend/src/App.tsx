import "./App.css"
import React, {useEffect, useState} from "react"

function App() {
  const [events, setEvents] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedEvent, setSelectedEvent] = useState<string>()


  const handleYearChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value))
  }

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvent(String(event.target.value))
  }

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8000/schedule/${selectedYear}`, {})

        if (!response.ok) {
          console.log(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        setEvents(data.event_names)

      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }

      }
    }

    void loadEvents()
  }, [selectedYear])

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8000/event/${selectedYear}/${selectedEvent}`, {})

        if (!response.ok) {
          console.log(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        console.log(data)
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") {
          return
        }
      }
    }

    void loadEvent()
  }, [selectedEvent, selectedYear]);

  return (
    <>
      <div>
        <label htmlFor="year-selector">Select Year: </label>
        <select id="year-selector" value={selectedYear} onChange={handleYearChange}>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>

      <div>
        <label>Select Event: </label>
        <select id={"event-selector"} value={selectedEvent} onChange={handleEventChange}>
          {events.map((event, index) => (
            <option key={index} value={event}>{event}</option>
          ))}
        </select>
      </div>
    </>
  )
}

export default App
