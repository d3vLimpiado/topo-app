import React from "react";
import { usePomoState, usePomoStateUpdate } from "../../App";
import style from "./pomo.module.css";

function Pomo() {
  const { sessionLength, breakLength, longBreakLength, sessionCount, status } =
    usePomoState();
  const updatePomo = usePomoStateUpdate();
  const [playing, setPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const timer = React.useRef<number | undefined>();

  React.useEffect(() => {
    setCurrentTime(
      (prev) =>
        (prev =
          status === "IN-SESSION"
            ? sessionLength * 60
            : status === "SHORT BREAK"
            ? breakLength * 60
            : longBreakLength * 60)
    );
  }, [status]);

  React.useEffect(() => {
    if (playing && currentTime === 0) {
      handleSkip();
    }
  }, [currentTime, playing]);

  const handleUpdatePlaying = () => {
    if (playing) {
      clearInterval(timer.current);
      setPlaying((prev) => !prev);
    } else {
      setPlaying((prev) => !prev);
      timer.current = setInterval(
        () => setCurrentTime((prev) => prev - 1),
        1000
      );
    }
  };

  const handleRestart = () => {
    setCurrentTime(
      (prev) =>
        (prev =
          status === "IN-SESSION"
            ? sessionLength * 60
            : status === "SHORT BREAK"
            ? breakLength * 60
            : longBreakLength * 60)
    );
    setPlaying((prev) => (prev = false));
    clearInterval(timer.current);
  };
  
  const handleReset = () => {
    updatePomo({
      type: "update_status",
      payload: "IN-SESSION",
    });
    updatePomo({
      type: "update_sessionCount",
      payload: 0,
    });
    setCurrentTime((prev) => (prev = sessionLength * 60));
    setPlaying((prev) => (prev = false));
    clearInterval(timer.current);
  };

  const handleSkip = () => {
    if (status === "IN-SESSION") {
      updatePomo({
        type: "update_sessionCount",
        payload: sessionCount < 3 ? sessionCount + 1 : 0,
      });
      updatePomo({
        type: "update_status",
        payload: sessionCount < 3 ? "SHORT BREAK" : "LONG BREAK",
      });
    } else {
      updatePomo({
        type: "update_status",
        payload: "IN-SESSION",
      });
    }
  };

  const formatTime = (count: number) => {
    let minutes: string | number = Math.floor(count / 60);
    let seconds: string | number = count % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${minutes}:${seconds}`;
  };

  return (
    <div className={style.pomo}>
      <h1>{status}</h1>
      <span className={style.timer}>{formatTime(currentTime)}</span>
      <div className={style.pomoButtonGroup}>
        <button onClick={handleUpdatePlaying}>
          {playing ? "PAUSE" : "START"}
        </button>
        <button onClick={handleRestart}>RESTART</button>
        <button onClick={handleReset}>RESET</button>
        <button onClick={handleSkip}>SKIP</button>
      </div>
    </div>
  );
}

export default Pomo;
