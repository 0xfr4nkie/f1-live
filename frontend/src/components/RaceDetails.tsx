export interface EventDetails {
  RoundNumber: number;
  Country: string;
  Location: string;
  OfficialEventName: string;
  EventDate: string;
  EventName: string;
  EventFormat: string;
  Session1: string;
  Session1Date: string;
  Session1DateUtc: string;
  Session2: string;
  Session2Date: string;
  Session2DateUtc: string;
  Session3: string;
  Session3Date: string;
  Session3DateUtc: string;
  Session4: string;
  Session4Date: string;
  Session4DateUtc: string;
  Session5: string;
  Session5Date: string;
  Session5DateUtc: string;
  F1ApiSupport: boolean;
}

interface RaceDetailsProps {
  event: EventDetails;
  onSessionClick: (sessionName: string) => void;
  activeSession?: string;
}

export const RaceDetails = ({ event, onSessionClick, activeSession }: RaceDetailsProps) => {
  const now = new Date();

  const sessions = [
    { name: event.Session1, date: event.Session1Date },
    { name: event.Session2, date: event.Session2Date },
    { name: event.Session3, date: event.Session3Date },
    { name: event.Session4, date: event.Session4Date },
    { name: event.Session5, date: event.Session5Date },
  ].filter((s) => s.name && s.name.trim() !== "");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isPast = (dateString: string) => new Date(dateString) < now;

  return (
    <div className="race-details-card">
      <header>
        <h2>{event.OfficialEventName}</h2>
        <p className="location">
          <strong>{event.Location}, {event.Country}</strong>
        </p>
      </header>

      <div className="sessions-list">
        <h3>Schedule</h3>
        {sessions.map((session, index) => {
          const past = isPast(session.date);
          const isActive = activeSession === session.name;

          return (
            <div
              key={index}
              className={`session-item ${past ? "clickable" : "disabled"} ${isActive ? "active" : ""}`}
              onClick={past ? () => onSessionClick(session.name) : undefined}
              role={past ? "button" : undefined}
              tabIndex={past ? 0 : undefined}
              onKeyDown={past ? (e) => e.key === "Enter" && onSessionClick(session.name) : undefined}
              aria-disabled={!past}
              title={past ? `View ${session.name} results` : "Session has not occurred yet"}
            >
              <div className="session-left">
                <span className="session-name">{session.name}</span>
                {!past && <span className="upcoming-badge">Upcoming</span>}
                {past && isActive && <span className="active-badge">Viewing</span>}
              </div>
              <span className="session-time">{formatDate(session.date)}</span>
              {past && <span className="session-chevron">›</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
