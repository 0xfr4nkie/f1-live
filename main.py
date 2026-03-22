import fastf1
import matplotlib.pyplot as plt
from fastf1.core import Session, Telemetry, Lap
from fastf1.mvapi import CircuitInfo


def main() -> None:
    session: Session = fastf1.get_session(2025, "Silverstone", "Q")
    session.load()

    pos_data: Telemetry = session.pos_data
    lap: Lap = session.laps.pick_fastest()
    pos: Telemetry = lap.get_pos_data()

    circuit_info: CircuitInfo = session.get_circuit_info()

    for _, corner in circuit_info.corners.iterrows():
        plt.plot(
            corner["X"],
            corner["Y"],
        )

    plt.show()


if __name__ == "__main__":
    main()
    fastf1.Cache.clear_cache()
