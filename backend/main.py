from datetime import datetime
from urllib.parse import unquote

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import util

app = FastAPI()

origins = ["*"]

# noinspection PyTypeChecker
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/schedule")
async def get_race_schedule_of_current_year():
    """
    Get the race schedule for the current year.

    Returns:
        A list containing event_names for all races in the current year.
    """
    schedule = util.get_gp_schedule(datetime.now().year)
    event_names = schedule["EventName"].tolist()
    return {"event_names": event_names}


@app.get("/schedule/{year}")
async def get_gp_schedule(year: int):
    """
    Get the race schedule for a specific year.

    Args:
        year: The year for which to retrieve the race schedule.

    Returns:
        A dictionary containing event_names for all races in the specified year.
    """

    schedule = util.get_gp_schedule(year)
    event_names = schedule["EventName"].tolist()
    return {"event_names": event_names}


@app.get("/event/{year}/{round_number}")
async def get_event_by_year_and_name(year: int, round_number: int):
    """
    Get detailed information about a specific event by year and round number.

    Args:
        year: The year of the event.
        round_number: The round number of the event.

    Returns:
        A dictionary containing detailed information about the requested event.
    """
    event = util.get_event_by_round_number(year, round_number)
    return event.to_dict()


@app.get("/session/{year}/{round_number}/{session_name:path}")
async def get_session_results(year: int, round_number: int, session_name: str):
    """
    Get results/standings for a specific session of a Grand Prix.

    Args:
        year: The year of the event.
        round_number: The round number of the event.
        session_name: The session name (e.g. 'Race', 'Qualifying', 'Practice 1').

    Returns:
        A list of driver result records for the session.
    """
    decoded_session = unquote(session_name)
    try:
        results = util.get_session_results(year, round_number, decoded_session)
        return {"session": decoded_session, "results": results}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Session data not available: {str(e)}")
