import fastf1


def get_gp_schedule(year: int):
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    return schedule


def get_event_by_round_number(year: int, round_number: int):
    event = fastf1.get_event(year, round_number)
    return event
