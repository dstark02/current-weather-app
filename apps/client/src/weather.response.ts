interface WeatherResponse {
  cityName: string;
  country: string;
  summary: string;
  description: string;
  icon: string;
  coord: Coord;
  windSpeed: number;
  temp: Temp;
}

interface Coord {
  lon: number;
  lat: number;
}

interface Temp {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}
