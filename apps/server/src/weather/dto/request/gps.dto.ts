import { IsNotEmpty, IsNumberString } from 'class-validator';

export class GpsDto {
  @IsNotEmpty()
  @IsNumberString()
  lat: number;

  @IsNotEmpty()
  @IsNumberString()
  lon: number;
}
