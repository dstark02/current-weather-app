import { IsNotEmpty } from 'class-validator';

export class ZipDto {
  @IsNotEmpty()
  zip: string;
}
