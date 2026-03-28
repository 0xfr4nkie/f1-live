import "./App.css"
import React, {useEffect, useState} from "react"
import {Dropdown} from "./components/Dropdown.tsx";

function App() {
  const years = Array.from({length: new Date().getFullYear() - 2010 + 1}, (_, i) => 2010 + i)
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
          console.error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        setEvents(data.event_names)

      } catch (err) {
        console.error(`Error fetching events: ${err}`)
      }
    }

    void loadEvents()
  }, [selectedYear])

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8000/event/${selectedYear}/${selectedEvent}`, {})

        if (!response.ok) {
          console.error(`Request failed: ${response.status}`)
        }

        const data = await response.json()
        console.log(data) //TODO: Remove
      } catch (err) {
        console.error(`Error fetching event: ${err}`)
      }
    }

    void loadEvent()
  }, [selectedEvent, selectedYear]);

  return (
    <>
      <Dropdown label={"Select Year"} value={selectedYear} onChange={handleYearChange} options={years}/>
      <Dropdown label={"Select Event"} value={selectedEvent} onChange={handleEventChange} options={events}/>
    </>
  )
}

export default App