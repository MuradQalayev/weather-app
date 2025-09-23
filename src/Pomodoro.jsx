import React, { useState, useEffect, useContext } from "react";
import "./Pomodoro.css"; 
import { translations } from "./translationsOfLanguages/translations";
import { LanguageContext } from "./LanguageContext";

function Pomodoro({ isPlaying, dispatch, audio, pomodoroState , setPomodoroState,showPomodoro}) {
  const { language } = useContext(LanguageContext);

  const [inputMinutes, setInputMinutes] = useState(25);
  const [showModal, setShowModal] = useState(false);


  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartStop = () => {
    if (!pomodoroState.isActive) {
      if (audio) {
        audio.muted = false;
        audio.play();
      }
      if (!isPlaying) dispatch({ type: "TOGGLE_PLAY" });
    } else {
      if (audio) audio.pause();
      if (isPlaying) dispatch({ type: "TOGGLE_PLAY" });
    }
    setPomodoroState((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleReset = () => {
    setPomodoroState((prev) => ({ ...prev, isActive: false, time: inputMinutes * 60 }));
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (isPlaying) dispatch({ type: "TOGGLE_PLAY" });
  };

  const handleSetTime = () => {
    setPomodoroState((prev) => ({ ...prev, time: inputMinutes * 60 }));
  };
  useEffect(() => {
    if (pomodoroState.time === 0 && pomodoroState.isActive) {
      setPomodoroState((prev) => ({ ...prev, isActive: false }));

      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      if (isPlaying) dispatch({ type: "TOGGLE_PLAY" });

      setShowModal(true);
    }
  }, [
    pomodoroState.time,
    pomodoroState.isActive,
    audio,
    isPlaying,
    dispatch,
    setPomodoroState,
  ]);


console.log(pomodoroState.time);
  return (
    <div className="pomodoro-container">
      <h3>{translations[language].pomodoro}</h3>
      <div className="pomodoro-timer">{formatTime(pomodoroState.time)}</div>

      <div className="pomodoro-input">
        <input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(Number(e.target.value))}
        />
        <button onClick={handleSetTime}>{translations[language].set}</button>
      </div>

      <div className="pomodoro-buttons">
        <button onClick={handleStartStop}>
          {pomodoroState.isActive
            ? translations[language].stop
            : translations[language].start}
        </button>
        <button onClick={handleReset}>{translations[language].reset}</button>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {!pomodoroState.isBreak ? (
              <>
                <h3>{translations[language].sessionComplete}</h3>
                <p>{translations[language].takeBreak}</p>
                <div className="modal-buttons">
                  <button
                    onClick={() => {
                      setPomodoroState((prev) => ({ ...prev, isBreak: true, time: 10 * 60 }));
                      setShowModal(false);
                      setPomodoroState((prev) => ({ ...prev, isActive: true }));
                    }}
                  >
                    {translations[language].startBreak}
                  </button>
                  <button
                    onClick={() => {
                      setPomodoroState((prev) => ({ ...prev, isBreak: false, time: inputMinutes * 60 }));
                      setShowModal(false);
                    }}
                  >
                    {translations[language].skipBreak}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{translations[language].breakOver}</h3>
                <p>{translations[language].readyForFocus}</p>
                <div className="modal-buttons">
                  <button
                    onClick={() => {
                      setPomodoroState((prev) => ({ ...prev, isBreak: false, time: inputMinutes * 60 }));
                      setShowModal(false);
                      setPomodoroState((prev) => ({ ...prev, isActive: true }));
                    }}
                  >
                    {translations[language].startFocus}
                  </button>
                  <button onClick={() => setShowModal(false)}>
                    {translations[language].later}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pomodoro;