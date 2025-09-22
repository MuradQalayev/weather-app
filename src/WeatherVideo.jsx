import React from 'react'
import { weatherVideos, getWeatherCategory } from './WeatherCard'

const WeatherVideo = ({ weatherCode, isDay }) => {
  const category = getWeatherCategory(weatherCode);
  const videoLink = isDay 
    ? weatherVideos[category].day 
    : weatherVideos[category].night;

  return (
    <div>
      <video key={videoLink} autoPlay muted loop playsInline>
        <source src={`/videos/${videoLink}`} type="video/mp4" />
        Your browser does not support the video tag.
    </video>
    </div>
  )
}

export default WeatherVideo;
