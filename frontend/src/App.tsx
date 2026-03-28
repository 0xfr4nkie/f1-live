import "./App.css"
import React, {useEffect, useState} from "react"
import {Dropdown} from "./components/Dropdown.tsx";

function App() {
  const years = Array.from({length: new Date().getFullYear() - 2010 + 1}, (_, i) => 2010 + i)
  const [schedule, setSchedule] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<number>(1)
  const [selectedEvent, setSelectedEvent] = useState<string>()


  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value))
    setSelectedEvent(undefined)
    setSelectedRoundNumber(1)
  }

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const eventName = event.target.value
    setSelectedEvent(eventName)
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
        setSelectedEvent(data.event_names[0])

      } catch (err) {
        console.error(`Error fetching events: ${err}`)
      }
    }

    void loadEvents()
  }, [selectedYear])

  useEffect(() => {
    if (!selectedEvent) return

    const loadEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8000/event/${selectedYear}/${selectedRoundNumber}`, {})

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
  }, [selectedEvent, selectedYear, selectedRoundNumber]);

  return (
    <>
      <Dropdown label={"Select Year"} value={selectedYear} onChange={handleYearChange} options={years}/>
      <Dropdown label={"Select Grand Prix"} value={selectedEvent} onChange={handleEventChange} options={schedule}/>
    </>
  )
}

export default App