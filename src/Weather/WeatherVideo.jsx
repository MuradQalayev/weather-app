import React from 'react'
import { weatherVideos, getWeatherCategory } from '../Weather/WeatherCard'

const WeatherVideo = ({ weatherCode, isDay }) => {
  const category = getWeatherCategory(weatherCode);
  const videoLink = isDay 
    ? weatherVideos[category].day 
    : weatherVideos[category].night;

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      return(
        <>
          <div>
            <img
              src={`../public/mobile.jpg`}
              alt={category}
              className="weather-background-image"
            />
          </div>
        </>
      )
    }

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
