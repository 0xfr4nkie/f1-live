import fastf1


def get_race_schedule(year: int):
    schedule = fastf1.get_event_schedule(year)
    return schedule


def get_event(year: int, name: str):
    event = fastf1.get_event(year, name)
    return event
