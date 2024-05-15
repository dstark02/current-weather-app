import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe('WeatherController', () => {
  let weatherController: WeatherController;
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [WeatherService],
      imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    weatherController = module.get<WeatherController>(WeatherController);
    weatherService = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(weatherController).toBeDefined();
  });

  describe('getGpsWeather', () => {
    it('should call weatherService.getGpsWeather()', async () => {
      const spy = jest.spyOn(weatherService, 'getGpsWeather');
      weatherController.getGpsWeather({ lat: 1, lon: 1 });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getCityWeather', () => {
    it('should call weatherService.getWeather()', async () => {
      const spy = jest.spyOn(weatherService, 'getCityWeather');
      weatherController.getCityWeather({ cityName: 'Vancouver' });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getZipCodeWeather', () => {
    it('should call weatherService.getZipCodeWeather()', async () => {
      const spy = jest.spyOn(weatherService, 'getZipCodeWeather');
      weatherController.getZipCodeWeather({ zip: 'V5T,CA' });
      expect(spy).toHaveBeenCalled();
    });
  });
});
