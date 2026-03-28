import "./App.css"
import React, {useEffect, useState} from "react"
import {Dropdown} from "./components/Dropdown.tsx";

function App() {
  const [events, setEvents] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedEvent, setSelectedEvent] = useState<string>()


  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
        console.log(data) //TODO: Remove
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
      <Dropdown value={selectedYear} onChange={handleYearChange} options={[2024, 2025, 2026]}/>
      <Dropdown value={selectedEvent} onChange={handleEventChange} options={events}/>
    </>
  )
}

export default App