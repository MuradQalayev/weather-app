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

export default fetchWeather;