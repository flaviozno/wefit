import {
  IsEnum,
  IsEmail,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CreateAddressDto } from "./create-address.dto";

export class CreateFormDto {
  @ApiProperty({
    enum: ["FISICA", "JURIDICA"],
    description: "User type: FISICA or JURIDICA",
    example: "FISICA",
  })
  @IsEnum(["FISICA", "JURIDICA"])
  type: "FISICA" | "JURIDICA";

  @ApiProperty({
    required: false,
    description: "CNPJ for JURIDICA type",
    example: "12.345.678/0001-90",
  })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({
    required: false,
    description: "CPF for FISICA type",
    example: "123.456.789-00",
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({
    description: "User name",
    example: "John Doe",
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    description: "Phone number",
    example: "(11) 2345-6789",
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    required: false,
    description: "Mobile number",
    example: "(11) 91234-5678",
  })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiProperty({
    description: "User email",
    example: "john.doe@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Confirm user email",
    example: "john.doe@example.com",
  })
  @IsEmail()
  emailConfirmation: string;

  @ApiProperty({
    type: [CreateAddressDto],
    description: "List of addresses",
    example: [
      {
        cep: "12345-678",
        street: "Main Street",
        city: "New York",
        state: "NY",
        number: "0",
        complement: "Home",
        district: "Some One"
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  addresses: CreateAddressDto[];

  @ApiProperty({
    required: false,
    description: "Terms accepted",
    example: true,
  })
  @IsOptional()
  termsAccepted: boolean;
}
