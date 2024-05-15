export class WeatherResponseDto {
  cityName: string;
  country: string;
  summary: string;
  description: string;
  icon: string;
  coord: Coord;
  windSpeed: number;
  temp: Temp;
}

export class Coord {
  lon: number;
  lat: number;
}

export class Temp {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}
