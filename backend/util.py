import math

import fastf1
import pandas as pd


def get_gp_schedule(year: int):
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    return schedule


def get_event_by_round_number(year: int, round_number: int):
    event = fastf1.get_event(year, round_number)
    return event


def _format_timedelta(td) -> str | None:
    """Convert a pandas Timedelta to a human-readable string, or None if NaT."""
    if pd.isnull(td):
        return None
    total_seconds = td.total_seconds()
    minutes = int(total_seconds // 60)
    seconds = total_seconds % 60
    if minutes > 0:
        return f"{minutes}:{seconds:06.3f}"
    return f"{seconds:.3f}"


def get_session_results(year: int, round_number: int, session_name: str) -> list[dict]:
    """
    Load results for a specific session of a Grand Prix.

    Args:
        year: The championship year.
        round_number: The round number of the event.
        session_name: The session identifier (e.g. 'Race', 'Qualifying', 'Practice 1').

    Returns:
        A list of dicts with driver standings/results for that session.
    """
    session = fastf1.get_session(year, round_number, session_name)
    # Only load results — skip laps/telemetry/weather to keep it fast
    session.load(laps=False, telemetry=False, weather=False, messages=False)

    results = session.results

    records = []
    for _, row in results.iterrows():
        record = {
            "Position": None if pd.isnull(row.get("Position")) else int(row["Position"]),
            "ClassifiedPosition": row.get("ClassifiedPosition", ""),
            "DriverNumber": row.get("DriverNumber", ""),
            "Abbreviation": row.get("Abbreviation", ""),
            "FullName": row.get("FullName", ""),
            "TeamName": row.get("TeamName", ""),
            "TeamColor": row.get("TeamColor", ""),
            "GridPosition": None if pd.isnull(row.get("GridPosition")) else int(row["GridPosition"]),
            "Status": row.get("Status", ""),
            "Points": None if pd.isnull(row.get("Points")) else row["Points"],
            "Laps": None if pd.isnull(row.get("Laps")) else int(row["Laps"]),
            "Time": _format_timedelta(row.get("Time")),
            "Q1": _format_timedelta(row.get("Q1")),
            "Q2": _format_timedelta(row.get("Q2")),
            "Q3": _format_timedelta(row.get("Q3")),
        }
        records.append(record)

    return records
