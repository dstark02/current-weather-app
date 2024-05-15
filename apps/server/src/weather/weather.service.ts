import { Injectable } from '@nestjs/common';
import { CityDto, GpsDto, ZipDto } from './dto/request';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, map, Observable, switchMap } from 'rxjs';
import { AxiosError } from 'axios';
import { Coord, Temp, WeatherResponseDto } from './dto/response';

@Injectable()
export class WeatherService {
  readonly baseUrl = 'https://api.openweathermap.org';

  constructor(
    private config: ConfigService,
    private httpService: HttpService,
  ) {}

  getGpsWeather(gpsDto: GpsDto): Observable<WeatherResponseDto> {
    const apiKey = this.config.get('OPEN_WEATHER_API_KEY');
    return this.httpService
      .get('/data/2.5/weather', {
        baseURL: this.baseUrl,
        params: { lat: gpsDto.lat, lon: gpsDto.lon, appid: apiKey },
      })
      .pipe(
        map((response) => response.data),
        map((data) => this.customMap(data)),
        catchError((error: AxiosError) => {
          if (error.response) {
            throw error.response.data;
          } else {
            throw error;
          }
        }),
      );
  }

  getCityWeather(cityDto: CityDto): Observable<WeatherResponseDto> {
    const apiKey = this.config.get('OPEN_WEATHER_API_KEY');
    return this.httpService
      .get('/geo/1.0/direct', {
        baseURL: this.baseUrl,
        params: { q: cityDto.cityName, appid: apiKey },
      })
      .pipe(
        map((response) => response.data[0]),
        switchMap((data) =>
          this.getGpsWeather({ lat: data.lat, lon: data.lon }),
        ),
        catchError((error: AxiosError) => {
          if (error.response) {
            throw error.response.data;
          } else {
            throw error;
          }
        }),
      );
  }

  getZipCodeWeather(zipDto: ZipDto): Observable<WeatherResponseDto> {
    const apiKey = this.config.get('OPEN_WEATHER_API_KEY');
    return this.httpService
      .get('/geo/1.0/zip', {
        baseURL: this.baseUrl,
        params: { zip: zipDto.zip, appid: apiKey },
      })
      .pipe(
        map((response) => response.data),
        switchMap((data) =>
          this.getGpsWeather({ lat: data.lat, lon: data.lon }),
        ),
        catchError((error: AxiosError) => {
          if (error.response) {
            throw error.response.data;
          } else {
            throw error;
          }
        }),
      );
  }

  private kelvinToCelsius(data: any): number {
    const kelvinTemperature = data;
    const celsiusTemperature = kelvinTemperature - 273.15;
    return parseFloat(celsiusTemperature.toFixed(2));
  }

  // api returns quite a bit of data so only getting useful fields to handle it more easily on frontend
  customMap(data: any): WeatherResponseDto {
    const temp: Temp = {
      temp: this.kelvinToCelsius(data.main.temp),
      feels_like: this.kelvinToCelsius(data.main.feels_like),
      temp_min: this.kelvinToCelsius(data.main.temp_min),
      temp_max: this.kelvinToCelsius(data.main.temp_max),
      pressure: data.main.pressure,
      humidity: data.main.humidity,
    };

    const coord: Coord = {
      lon: data.coord.lon,
      lat: data.coord.lat,
    };

    return {
      cityName: data.name,
      country: data.sys.country,
      summary: data.weather[0]?.main || '',
      description: data.weather[0]?.description || '',
      icon: data.weather[0]?.icon || '',
      coord: coord,
      temp: temp,
      windSpeed: data.wind.speed,
    };
  }
}
