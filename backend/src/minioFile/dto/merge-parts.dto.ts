import { ApiProperty } from "@nestjs/swagger";

export class MergePartsDto {
  @ApiProperty()
  sha256: string;

  @ApiProperty()
  uploadId: string;
}
