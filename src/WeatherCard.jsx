import React from "react";
import "./weatherCard.css";

const getWeatherIcon = (code) => {
  const map = {
    0: "☀️",   // Clear sky
    1: "🌤",   // Mainly clear
    2: "⛅",   // Partly cloudy
    3: "☁️",   // Overcast
    45: "🌫",  // Fog
    48: "🌫",  // Depositing rime fog
    51: "🌦",  // Light drizzle
    61: "🌧",  // Rain
    71: "🌨",  // Snow
    80: "🌦",  // Showers
    95: "⛈",  // Thunderstorm
  };
  return map[code] || "❓";
};
export const weatherVideos = {
  clear: { day: "clear_day.mp4", night: "clear_night.mp4" },
  partly_cloudy: { day: "partly_cloudy_day.mp4", night: "partly_cloudy_night.mp4" },
  cloudy: { day: "cloudy.mp4", night: "cloudy.mp4" },
  rain: { day: "rain.mp4", night: "rain.mp4" },
  snow: { day: "snow.mp4", night: "snow.mp4" },
  storm: { day: "storm.mp4", night: "storm.mp4" },
  fog: { day: "fog.mp4", night: "fog.mp4" }
};
export const getWeatherCategory =(code) =>{
  if (code === 0) return "clear";
  if ([1, 2].includes(code)) return "partly_cloudy";
  if (code === 3) return "cloudy";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "rain";
  if ([71, 73, 75].includes(code)) return "snow";
  if ([95, 96, 99].includes(code)) return "storm";
  return "cloudy"; 
}


const WeatherCard = ({ city, min, max, weatherCode,time }) => {
  console.log("rendered");
  return (
    <div className="weather-card">
      <h3>{city}</h3>
      <div className="icon">{getWeatherIcon(weatherCode)}</div>
      <div>{time}</div>
      <p>
        <b>{min}°C</b> / <b>{max}°C</b>
      </p>
    </div>
  );
};

export default React.memo(WeatherCard)
