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

const WeatherCard = ({ city, min, max, weatherCode,time }) => {
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

export default WeatherCard;
