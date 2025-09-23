import React, { useContext, useEffect, useRef, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import "./weatherPage.css";
import WeatherCard from "./WeatherCard";
import { LanguageContext } from "./LanguageContext";
import { translations } from "./translationsOfLanguages/translations";
import WeatherVideo from "./WeatherVideo";
import fetchWeather from "./API/cityCoordinates";
import "../src/studymode.css";


function reducer(state, action) {
  switch (action.type) {
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    default:
      return state;
  }
}

const WeatherPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    city: "Baku",
    search: "",
    isPlaying: false,
  });
  const { language, switchLanguage } = useContext(LanguageContext);
  const forecastRef = useRef(null);

  function handleSearch() {
    if (!state.search.trim()) return;
    dispatch({
      type: "SET_CITY",
      payload:
        state.search.charAt(0).toUpperCase() + state.search.slice(1).toLowerCase(),
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
      <div className="navbar">
        <div className="nav-controls">
          <select
            value={language}
            onChange={(e) => switchLanguage(e.target.value)}
            className="language-dropdown"
          >
            <option value="en">🇬🇧 English</option>
            <option value="ru">🇷🇺 Русский</option>
            <option value="it">🇮🇹 Italiano</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="es">🇪🇸 Español</option>
          </select>
        </div>
      </div>

      <div className="hero">
        <div className="overlay">
          <h1>{translations[language].weatherApp}</h1>

          <div className="search-bar">
            <input
              type="text"
              value={state.search}
              onChange={(e) =>
                dispatch({ type: "SET_SEARCH", payload: e.target.value })
              }
              placeholder={translations[language].searchPlaceholder}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>
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
      </div>

      <div className="video-background no-scroll">
        <WeatherVideo
          weatherCode={data?.current_weather?.weathercode ?? 1}
          isDay={data?.current_weather?.is_day ?? 1}
        />
        <audio id="bg-music" loop muted>
          <source src="./src/assets/rain_music.mp3" type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>

        <button
          onClick={() => {
            const audio = document.getElementById("bg-music");
            if (audio.paused) {
              audio.muted = false;
              audio.play();
            } else {
              audio.pause();
            }
            dispatch({ type: "TOGGLE_PLAY" });
          }}
          className="music-toggle"
        >
          {state.isPlaying
            ? `🔊 ${translations[language].musicOn}`
            : `🔇${translations[language].musicOff} `}
        </button>

        <div ref={forecastRef} className="content">
          {/* <h2>{translations[language].moreInfo}</h2> */}
          {/* <p>{translations[language].weeklyForecast}</p> */}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
