import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAddressDto {
  @ApiProperty({ description: "CEP of the address", example: "12345-678" })
  @IsString()
  cep: string;

  @ApiProperty({
    description: "Street name of the address",
    example: "Main Street",
  })
  @IsString()
  street: string;

  @ApiProperty({
    required: false,
    description: "Number of the address",
    example: "123",
  })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({
    required: false,
    description: "Complement of the address",
    example: "Apt 202",
  })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ description: "City name", example: "New York" })
  @IsString()
  city: string;

  @ApiProperty({ description: "State name", example: "NY" })
  @IsString()
  state: string;

  @ApiProperty({
    required: false,
    description: "District or neighborhood name",
    example: "Downtown",
  })
  @IsOptional()
  @IsString()
  district?: string;
}
