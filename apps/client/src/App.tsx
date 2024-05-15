import { useState } from 'react';
import './App.css';

enum ActiveAPI {
  City = 'City',
  ZipCode = 'Zip Code',
  GPS = 'GPS',
}

const searchDescription: { [key in ActiveAPI]: string } = {
  [ActiveAPI.City]: "e.g. Vancouver",
  [ActiveAPI.ZipCode]: "e.g. V5Y,CA",
  [ActiveAPI.GPS]: "e.g. 45.50, -73.56",
}

const apiUrl: { [key in ActiveAPI]: string } = {
  [ActiveAPI.City]: "/api/weather/city",
  [ActiveAPI.ZipCode]: "/api/weather/zip",
  [ActiveAPI.GPS]: "/api/weather/gps",
}

const apiQueryParams: { [key in ActiveAPI]: string[] } = {
  [ActiveAPI.City]: ["cityName"],
  [ActiveAPI.ZipCode]: ["zip"],
  [ActiveAPI.GPS]: ["lat", "lon"],
}

function getApiUrl(api: ActiveAPI, searchText: string): string {
  if ((api !== ActiveAPI.City)) {
    searchText = searchText.replace(/\s+/g, ''); // get rid of whitespace
  }
  const params = new URLSearchParams();

  // edge case as single param value will be separated by comma e.g. V5T,CA
  if (api === ActiveAPI.ZipCode) {
    params.append(apiQueryParams[api][0], searchText)
  } else {
    const searchList = searchText.split(',');
    for (let i = 0; i < searchList.length; i++) {
      params.append(apiQueryParams[api][i], searchList[i])
    }
  }

  return `${apiUrl[api]}?${params.toString()}`;
}

function App() {
  const [searchText, setSearchText] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [activeApi, setActiveApi] = useState(ActiveAPI.City);
  const [error, setError] = useState('');
  const [placeholder, setPlaceholder] = useState(searchDescription[ActiveAPI.City]);

  const handleSearch = async () => {
    if (!searchText) {
      setError('Please enter a value in the search');
      return;
    }

    try {
      const apiUrl = getApiUrl(activeApi, searchText)

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeatherData(data);
      setError('');
    } catch (error) {
      setWeatherData(null);
      setError('Error fetching weather data');
    }
  };

  const handleToggle = (api: ActiveAPI) => {
    setSearchText('');
    setActiveApi(api);
    setWeatherData(null);
    setError('');
    setPlaceholder(searchDescription[api]);
  };

  return (
    <div>
      <h1>Current Weather Conditions</h1>
      <div>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={placeholder}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {Object.values(ActiveAPI).map(api => (
          <label key={api}>
            <input
              type="radio"
              name="searchOption"
              value={api}
              checked={activeApi === api}
              onChange={() => handleToggle(api)}
            />
            {api}
          </label>
        ))}
      </div>
      {error && <p>{error}</p>}
      {weatherData && (
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '20px' }}>
            <div>
              <p><b>City:</b> {weatherData.cityName}</p>
              <p><b>Country:</b> {weatherData.country}</p>
              <p><b>Coordinates:</b> {weatherData.coord.lat}, {weatherData.coord.lon}</p>
              <p><b>Weather:</b> {weatherData.summary}</p>
              <p><b>Description:</b> {weatherData.description}</p>
            </div>
          </div>
          <div>
            <div>
              <p><b>Temperature:</b> {weatherData.temp.temp} °C</p>
              <p><b>Temp Min:</b> {weatherData.temp.temp_min} °C</p>
              <p><b>Temp Max:</b> {weatherData.temp.temp_max} °C</p>
              <p><b>Humidity:</b> {weatherData.temp.humidity} %</p>
              <p><b>Wind Speed:</b> {weatherData.windSpeed} m/s</p>
            </div>
          </div>
          <div>
          <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
