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

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.get("/schedule/{year}")
async def get_race_schedule(year: int):
    schedule = util.get_race_schedule(year).to_dict()
    event_dates = schedule["EventDate"]
    event_names = schedule["EventName"]
    return { "event_dates": event_dates, "event_names": event_names}