import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { CityDto, GpsDto, ZipDto } from '../src/weather/dto/request';
import { AppModule } from '../src/app.module';
import * as nock from 'nock';

// This could be moved to another class to cleanup but left here for visibitlity
const current_weather_data_response = {
  coord: {
    lon: -123.1207,
    lat: 49.2827,
  },
  weather: [
    {
      id: 803,
      main: 'Clouds Test',
      description: 'broken clouds test',
      icon: '04d',
    },
  ],
  base: 'stations',
  main: {
    temp: 291.26,
    feels_like: 290.69,
    temp_min: 287.99,
    temp_max: 294.48,
    pressure: 1021,
    humidity: 60,
  },
  visibility: 10000,
  wind: {
    speed: 4.63,
    deg: 300,
  },
  clouds: {
    all: 75,
  },
  dt: 1715726093,
  sys: {
    type: 2,
    id: 2011597,
    country: 'CA',
    sunrise: 1715689785,
    sunset: 1715744885,
  },
  timezone: -25200,
  id: 6173331,
  name: 'E2E Test Vancouver',
  cod: 200,
};

const mapped_api_response = {
  cityName: 'E2E Test Vancouver',
  coord: { lat: 49.2827, lon: -123.1207 },
  country: 'CA',
  description: 'broken clouds test',
  icon: '04d',
  summary: 'Clouds Test',
  temp: {
    feels_like: 17.54,
    humidity: 60,
    pressure: 1021,
    temp: 18.11,
    temp_max: 21.33,
    temp_min: 14.84,
  },
  windSpeed: 4.63,
};

describe('App e2e', () => {
  let app: INestApplication;

  const openWeatherBaseUrl = 'https://api.openweathermap.org';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Weather Service', () => {
    describe('Get Weather data by City Name', () => {
      // mock the open weather apis - we don't want to call actual endpoint for tests
      // current weather api
      nock(openWeatherBaseUrl)
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, current_weather_data_response);
      // open weather city api
      nock(openWeatherBaseUrl)
        .get('/geo/1.0/direct')
        .query(true)
        .reply(200, [
          {
            lat: 49.2827,
            lon: -123.1207,
            name: 'Vancouver',
            country: 'CA',
            state: 'British Columbia',
          },
        ]);

      it('should return weather data', async () => {
        const dto: CityDto = {
          cityName: 'Vancouver',
        };
        return pactum
          .spec()
          .get('/weather/city')
          .withQueryParams(dto)
          .expectStatus(200)
          .expectBody(mapped_api_response);
      });

      it('should throw an exception if cityName is empty', async () => {
        const dto: CityDto = {
          cityName: '',
        };
        return pactum
          .spec()
          .get('/weather/city')
          .withQueryParams(dto)
          .expectStatus(400);
      });
    });

    describe('Get Weather data by Zip Code', () => {
      nock(openWeatherBaseUrl)
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, current_weather_data_response);

      // open weather zip code api
      nock(openWeatherBaseUrl)
        .get('/geo/1.0/zip')
        .query(true)
        .reply(200, [
          {
            zip: 'V6Z',
            name: 'Vancuver',
            lat: 49.2827,
            lon: -123.1207,
            country: 'CA',
          },
        ]);

      it('should return weather data', async () => {
        const dto: ZipDto = {
          zip: 'V6Z,CA',
        };
        return pactum
          .spec()
          .get('/weather/zip')
          .withQueryParams(dto)
          .expectStatus(200)
          .expectBody(mapped_api_response);
      });

      it('should throw an exception if zip is empty', async () => {
        const dto: ZipDto = {
          zip: '',
        };
        return pactum
          .spec()
          .get('/weather/zip')
          .withQueryParams(dto)
          .expectStatus(400);
      });
    });

    describe('Get Weather data by GPS coordinates', () => {
      nock(openWeatherBaseUrl)
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, current_weather_data_response);

      it('should return weather data', async () => {
        const dto: GpsDto = {
          lat: 49.2827,
          lon: -123.1207,
        };
        return pactum
          .spec()
          .get('/weather/gps')
          .withQueryParams(dto)
          .expectStatus(200)
          .expectBody(mapped_api_response);
      });
    });
  });
});
