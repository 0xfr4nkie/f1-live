import "./App.css"
import { useEffect, useState } from "react"

type EventItem = {
  name: string
  date: Date
}

function App() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadSchedule = async () => {
      try {
        const response = await fetch("http://localhost:8000/schedule/2025", {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data: {
          event_names: Record<string, string>
          event_dates: Record<string, string>
        } = await response.json()

        const entries = Object.keys(data.event_names)
          .sort((a, b) => Number(a) - Number(b))
          .map((key) => ({
            name: data.event_names[key],
            date: new Date(data.event_dates[key]),
          }))

        setEvents(entries)
        setError(null)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }

        setError(err instanceof Error ? err.message : "Failed to load schedule")
      }
    }

    void loadSchedule()

    return () => {
      controller.abort()
    }
  }, [])

  if (error) {
    return <p role="alert">Error: {error}</p>
  }

  return (
    <ul>
      {events.map((event) => (
        <li key={`${event.name}-${event.date.toISOString()}`}>
          {event.name} — {event.date.toLocaleDateString()}
        </li>
      ))}
    </ul>
  )
}

export default App
