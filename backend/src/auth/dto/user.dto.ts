import { ApiProperty } from "@nestjs/swagger";

export class TokenPayload {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
}
