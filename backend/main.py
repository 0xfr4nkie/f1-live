from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import util

app = FastAPI()

origins = ["http://localhost:5173"]

# noinspection PyTypeChecker
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/schedule")
async def get_race_schedule_of_current_year():
    """
    Get the race schedule for the current year.

    Returns:
        A dictionary containing event_names for all races in the current year.
    """
    schedule = util.get_race_schedule(datetime.now().year).to_dict()
    event_names = schedule["EventName"]
    return {"event_names": event_names}


@app.get("/schedule/{year}")
async def get_race_schedule(year: int):
    """
    Get the race schedule for a specific year.

    Args:
        year: The year for which to retrieve the race schedule.

    Returns:
        A dictionary containing event_names for all races in the specified year.
    """

    schedule = util.get_race_schedule(year)
    event_names = schedule["EventName"].tolist()
    return {"event_names": event_names}


@app.get("/event/{year}/{name}")
async def get_event_by_year_and_name(year: int, name: str):
    """
    Get detailed information about a specific event by year and name.

    Args:
        year: The year of the event.
        name: The name of the event.

    Returns:
        A dictionary containing detailed information about the requested event.
    """
    event = util.get_event(year, name)
    return event.to_dict()
