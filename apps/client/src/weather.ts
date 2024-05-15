export interface WeatherResponse {
    cityName: string;
    country: string;
    summary: string;
    description: string;
    icon: string;
    coord: Coord;
    windSpeed: number;
    temp: Temp;
  }
  
  export interface Coord {
    lon: number;
    lat: number;
  }
  
  export interface Temp {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  }
  
  export enum ActiveAPI {
    City = 'City',
    ZipCode = 'Zip Code',
    GPS = 'GPS',
  }
  