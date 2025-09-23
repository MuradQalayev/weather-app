import React from "react";
import '../styles/weatherCard.css'
const getWeatherIcon = (code) => {
  if ([0].includes(code)) return "☀️";   // Clear sky
  if ([1].includes(code)) return "🌤";   // Mainly clear
  if ([2].includes(code)) return "⛅";   // Partly cloudy
  if ([3].includes(code)) return "☁️";   // Overcast
  if ([45, 48].includes(code)) return "🌫";   // Fog
  if ([51, 53, 55].includes(code)) return "🌦"; // Drizzle
  if ([61, 63, 65].includes(code)) return "🌧"; // Rain
  if ([71, 73, 75, 77].includes(code)) return "🌨"; // Snow
  if ([80, 81, 82].includes(code)) return "🌦"; // Showers
  if ([95, 96, 99].includes(code)) return "⛈"; // Thunderstorm

  return "❓"; 
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
