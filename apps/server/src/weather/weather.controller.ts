import { Controller, Get, Query } from '@nestjs/common';
import { CityDto, GpsDto, ZipDto } from './dto/request';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('gps')
  getGpsWeather(@Query() gpsDto: GpsDto) {
    return this.weatherService.getGpsWeather(gpsDto);
  }

  @Get('city')
  getCityWeather(@Query() cityDto: CityDto) {
    return this.weatherService.getCityWeather(cityDto);
  }

  @Get('zip')
  getZipCodeWeather(@Query() zipDto: ZipDto) {
    return this.weatherService.getZipCodeWeather(zipDto);
  }
}
