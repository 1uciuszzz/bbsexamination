import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlphanumeric,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty()
  @MaxLength(20)
  @MinLength(3)
  @IsString()
  @IsAlphanumeric("en-US")
  username: string;

  @ApiProperty()
  @MaxLength(32)
  @MinLength(8)
  @IsString()
  @IsAlphanumeric("en-US")
  password: string;
}
