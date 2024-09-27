import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateFormDto } from "./create-form.dto";

export class UpdateFormDto extends PartialType(CreateFormDto) {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  email?: string;
}
