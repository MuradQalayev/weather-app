import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import './weatherPage.css';
import WeatherCard from './WeatherCard';
import { LanguageContext } from './LanguageContext';
import { translations } from './translationsOfLanguages/translations';

const fetchWeather = async (city) => {
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );
  if (!geoRes.ok) throw new Error("Geocoding failed");

  const geoData = await geoRes.json();
  const place = geoData.results[0];

  if (
    !geoData.results ||
    geoData.results.length === 0 ||
    !place.name ||
    !place.country ||
    (place.population && place.population < 1000) ||
    city.length < 2
  ) {
    throw new Error("City not found");
  }

  const { latitude, longitude } = geoData.results[0];

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`
  );
  if (!response.ok) throw new Error("Weather API failed");

  return response.json();
};

const WeatherPage = () => {
  const [city, setCity] = useState('Baku');
  const [search, setSearch] = useState('');
  const [localTime, setLocalTime] = useState('');
  const { language, switchLanguage } = useContext(LanguageContext);
  const [isPlaying, setIsPlaying] = useState(false);

  function handleSearch() {
    if (!search.trim()) return;
    setCity(search.charAt(0).toUpperCase() + search.slice(1).toLowerCase());
    setSearch('');
  }

  const { data } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    enabled: !!city,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
  });

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
      setLocalTime(formatter.format(new Date()));
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
      <div className="language-switcher">
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

      <div className="hero">
        <div className="overlay">
          <h1>{translations[language].weatherApp}</h1>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={translations[language].searchPlaceholder}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>
              {translations[language].searchButton}
            </button>
            
          </div>

          {data && (
            <>
              <p>{translations[language].city}: <b>{city}</b></p>
              <p>{translations[language].temperature}: <b>{data.current_weather?.temperature}°C</b></p>
              <p>{translations[language].time}: <b>{trimmedTime(data.current_weather?.time)}</b></p>
              <p>{data.timezone}</p>
            </>
          )}
        </div>
        <div className='clock'>
          {localTime && (
              <div>
                {localTime}
              </div>
            )}
        </div>
      </div>

      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="./src/assets/rain.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
                    setIsPlaying(true);
                  } else {
                    audio.pause();
                    setIsPlaying(false);
                  }
                }}
                className="music-toggle"
              >
                {isPlaying ? "🔊 Music On" : "🔇 Music Off"}
              </button>



        <div className="content">
          <h2>{translations[language].moreInfo}</h2>
          <p>{translations[language].weeklyForecast}</p>
          <div>
            {data?.daily && (
              <div className="forecast">
                {data.daily.time.map((date, i) => (
                  <WeatherCard
                    key={date}
                    time={date}
                    city={city}
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
