interface DriverResult {
  Position: number | null;
  ClassifiedPosition: string;
  DriverNumber: string;
  Abbreviation: string;
  FullName: string;
  TeamName: string;
  TeamColor: string;
  GridPosition: number | null;
  Status: string;
  Points: number | null;
  Laps: number | null;
  Time: string | null;
  Q1: string | null;
  Q2: string | null;
  Q3: string | null;
}

interface SessionStandingsProps {
  sessionName: string;
  results: DriverResult[];
  onBack: () => void;
}

type SessionType = "race" | "qualifying" | "practice" | "sprint";

function getSessionType(sessionName: string): SessionType {
  const lower = sessionName.toLowerCase();
  if (lower === "race") return "race";
  if (lower.includes("qualifying") || lower.includes("shootout")) return "qualifying";
  if (lower.includes("sprint") && !lower.includes("qualifying")) return "sprint";
  return "practice";
}

function formatTime(t: string | null): string {
  return t ?? "—";
}

export const SessionStandings = ({ sessionName, results, onBack }: SessionStandingsProps) => {
  const type = getSessionType(sessionName);
  const isRaceType = type === "race" || type === "sprint";
  const isQualifying = type === "qualifying";

  return (
    <div className="standings-container">
      <div className="standings-header">
        <button className="back-btn" onClick={onBack} aria-label="Back to schedule">
          <span className="back-arrow">←</span> Back
        </button>
        <h3 className="standings-title">{sessionName} Results</h3>
      </div>

      <div className="standings-table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th className="col-pos">POS</th>
              <th className="col-driver">Driver</th>
              <th className="col-team">Team</th>
              {isRaceType && <th className="col-grid">Grid</th>}
              {isRaceType && <th className="col-laps">Laps</th>}
              {isRaceType && <th className="col-time">Time / Status</th>}
              {isRaceType && <th className="col-pts">PTS</th>}
              {isQualifying && <th className="col-q">Q1</th>}
              {isQualifying && <th className="col-q">Q2</th>}
              {isQualifying && <th className="col-q">Q3</th>}
              {type === "practice" && <th className="col-time">Best Lap</th>}
            </tr>
          </thead>
          <tbody>
            {results.map((driver, idx) => (
              <tr key={driver.DriverNumber || idx} className="standings-row">
                <td className="col-pos">
                  <span className="pos-badge">{driver.ClassifiedPosition || (driver.Position ?? "—")}</span>
                </td>
                <td className="col-driver">
                  <span
                    className="team-color-bar"
                    style={{ backgroundColor: `#${driver.TeamColor}` }}
                  />
                  <div className="driver-info">
                    <span className="driver-abbr">{driver.Abbreviation}</span>
                    <span className="driver-name">{driver.FullName}</span>
                  </div>
                </td>
                <td className="col-team">{driver.TeamName}</td>
                {isRaceType && <td className="col-grid">{driver.GridPosition ?? "—"}</td>}
                {isRaceType && <td className="col-laps">{driver.Laps ?? "—"}</td>}
                {isRaceType && (
                  <td className="col-time">
                    {driver.Status && driver.Status !== "Finished"
                      ? driver.Status
                      : formatTime(driver.Time)}
                  </td>
                )}
                {isRaceType && <td className="col-pts">{driver.Points ?? 0}</td>}
                {isQualifying && <td className="col-q">{formatTime(driver.Q1)}</td>}
                {isQualifying && <td className="col-q">{formatTime(driver.Q2)}</td>}
                {isQualifying && <td className="col-q">{formatTime(driver.Q3)}</td>}
                {type === "practice" && <td className="col-time">{formatTime(driver.Time)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export type { DriverResult };
