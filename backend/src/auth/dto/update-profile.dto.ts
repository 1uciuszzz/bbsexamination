import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "@prisma/client";

export class UpdateProfileDto {
  @ApiProperty()
  avatarId: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  birthday: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  gender: Gender;
}
