import React, {
  useContext,
  useEffect,
  useRef,
  useReducer,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import Pomodoro from "../Pomodoro/Pomodoro";
import fetchWeather from "../API/cityCoordinates";
import { translations } from "../TranslationsOfLanguages/translations";
import { LanguageContext } from "../Context/LanguageContext";
import WeatherCard from "../Weather/WeatherCard";
import "../styles/weatherPage.css";
import WeatherVideo from "../Weather/WeatherVideo";

import Navbar from "../navigationBar/Navbar";
import GeminiModal from "../AI/GeminiChat";

function reducer(state, action) {
  switch (action.type) {
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "TOGGLE_WEATHER":
      return { ...state, showWeather: !state.showWeather };
    case "TOGGLE_POMODORO":
      return { ...state, showPomodoro: !state.showPomodoro };
    default:
      return state;
  }
}

const WeatherPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    city: "Baku",
    search: "",
    isPlaying: false,
    showWeather: true,
    showPomodoro: true,
  });
  const { language, switchLanguage } = useContext(LanguageContext);
  const forecastRef = useRef(null);
  const audioRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [pomodoroState, setPomodoroState] = useState({
    time: 25 * 60,
    isActive: false,
    isBreak: false,
  });

  useEffect(() => {
    if (pomodoroState.time === 0 && !state.showPomodoro) {
      dispatch({ type: "TOGGLE_POMODORO" });
    }
  }, [pomodoroState.time, state.showPomodoro, dispatch]);

  function handleSearch() {
    if (!state.search.trim()) return;
    dispatch({
      type: "SET_CITY",
      payload:
        state.search.charAt(0).toUpperCase() +
        state.search.slice(1).toLowerCase(),
    });
    dispatch({
      type: "SET_SEARCH",
      payload: "",
    });
  }

  const { data } = useQuery({
    queryKey: ["weather", state.city],
    queryFn: () => fetchWeather(state.city),
    enabled: !!state.city,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });
  const clockRef = useRef();
  //for pomodoro
  useEffect(() => {
    let interval = null;
    if (pomodoroState.isActive && pomodoroState.time > 0) {
      interval = setInterval(() => {
        setPomodoroState((prev) => ({ ...prev, time: prev.time - 1 }));
      }, 1000);
    } else if (pomodoroState.time === 0 && pomodoroState.isActive) {
      setPomodoroState((prev) => ({ ...prev, isActive: false }));
    }
    return () => clearInterval(interval);
  }, [pomodoroState.isActive, pomodoroState.time]);

  useEffect(() => {
    if (!data?.timezone) return;

    const updateClock = () => {
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: data.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      if (clockRef.current) {
        clockRef.current.textContent = formatter.format(new Date());
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [data?.timezone]);

  function trimmedTime(time) {
    return time.slice(0, 10);
  }

  return (
    <div className="page">
      <div className="video-background">
        <WeatherVideo
          weatherCode={data?.current_weather?.weathercode ?? 1}
          isDay={data?.current_weather?.is_day ?? 1}
        />
      </div>

      <audio id="bg-music" loop muted ref={audioRef}>
        <source src="./src/assets/rain_music.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <div className="navbar">
        <Navbar
          switchLanguage={switchLanguage}
          language={language}
          setIsModalOpen={setIsModalOpen}
          translations={translations}
          state={state}
          dispatch={dispatch}
        />
      </div>

      <div className="hero">
        <div
          className={`main-layout ${
            (!state.showWeather && state.showPomodoro) ||
            (!state.showPomodoro && state.showWeather)
              ? "centered"
              : ""
          }`}
        >
          {state.showWeather && (
            <div className="overlay">
              <h1>{translations[language].weatherApp}</h1>

              <div className="search-bar">
                <input
                  data-cy="city-input"
                  type="text"
                  value={state.search}
                  onChange={(e) =>
                    dispatch({ type: "SET_SEARCH", payload: e.target.value })
                  }
                  placeholder={translations[language].searchPlaceholder}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button data-cy="search-button" onClick={handleSearch}>
                  {translations[language].searchButton}
                </button>
              </div>

              <div className="clock" ref={clockRef}></div>

              {data && (
                <>
                  <p>
                    {translations[language].city}: <b>{state.city}</b>
                  </p>
                  <p>
                    {translations[language].temperature}:{" "}
                    <b>{data.current_weather?.temperature}°C</b>
                  </p>
                  <p>
                    {translations[language].time}:{" "}
                    <b>{trimmedTime(data.current_weather?.time)}</b>
                  </p>
                  <p>{data.timezone}</p>
                </>
              )}
            </div>
          )}
          {state.showPomodoro ? (
            <Pomodoro
              pomodoroState={pomodoroState}
              setPomodoroState={setPomodoroState}
              isPlaying={state.isPlaying}
              dispatch={dispatch}
              audio={audioRef.current}
              showPomodoro={state.showPomodoro}
            />
          ) : null}
        </div>
        <GeminiModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setQuery("");
            setResponse("");
          }}
          query={query}
          setQuery={setQuery}
          response={response}
          setResponse={setResponse}
          onSetPomodoro={(minutes) =>
            setPomodoroState((prev) => ({ ...prev, time: minutes * 60 }))
          }
        />
      </div>
      {state.showWeather ? (
        <div ref={forecastRef} className="content">
          <div>
            {data?.daily && (
              <div className="forecast">
                {data.daily.time.map((date, i) => (
                  <WeatherCard
                    key={date}
                    time={date}
                    city={state.city}
                    min={data.daily.temperature_2m_min[i]}
                    max={data.daily.temperature_2m_max[i]}
                    weatherCode={data.daily.weathercode[i]}
                  />
                ))}
                <div className="weather-footer">
                  <small>
                    ⚖️ Powered by Google Gemini & Open-Meteo | For study/demo
                    purposes only.{" "}
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherPage;
