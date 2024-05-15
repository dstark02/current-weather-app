import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { WeatherResponseDto } from './dto/response';
import { GpsDto } from './dto/request';
import { mockDeep } from 'jest-mock-extended';

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let configService: ConfigService;
  const httpService = mockDeep<HttpService>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        {
          provide: HttpService,
          useValue: httpService,
        },
        WeatherService,
      ],
    }).compile();

    weatherService = app.get<WeatherService>(WeatherService);
    configService = app.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(weatherService).toBeDefined();
  });

  describe('getGpsWeather', () => {
    it('should return weather data', (done) => {
      const mockWeatherResponse: WeatherResponseDto = {
        cityName: 'New York',
        country: 'US',
        summary: 'Cloudy',
        description: 'Cloudy with a chance of rain',
        icon: '01d',
        coord: { lat: 40.7128, lon: -74.006 },
        temp: {
          temp: 20,
          feels_like: 18,
          temp_min: 18,
          temp_max: 22,
          pressure: 1013,
          humidity: 70,
        },
        windSpeed: 5,
      };

      const result: AxiosResponse<WeatherResponseDto> = {
        data: mockWeatherResponse,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as any },
      };

      httpService.get.mockReturnValue(of(result));

      jest
        .spyOn(weatherService, 'customMap')
        .mockReturnValue(mockWeatherResponse);

      jest.spyOn(configService, 'get').mockReturnValue('MOCK_API_KEY');

      const gpsDto: GpsDto = { lat: 40.7128, lon: -74.006 };

      weatherService.getGpsWeather(gpsDto).subscribe((res) => {
        expect(res).toEqual(mockWeatherResponse);
        done();
      });
    });
  });
});
