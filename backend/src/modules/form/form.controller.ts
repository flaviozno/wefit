import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Query,
  Delete,
} from "@nestjs/common";
import { FormService } from "./form.service";
import { CreateFormDto } from "./dto/create-form.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
} from "@nestjs/swagger";

@ApiTags("Form")
@ApiBearerAuth()
@Controller("form")
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post("create")
  @ApiOperation({ summary: "Create a new form" })
  @ApiBody({ type: CreateFormDto, description: "Form data" })
  @ApiResponse({ status: 201, description: "Form successfully created" })
  @ApiResponse({ status: 400, description: "Invalid form data" })
  async createForm(@Body() createFormDto: CreateFormDto) {
    return await this.formService.createForm(createFormDto);
  }

  @Get("all")
  @ApiOperation({ summary: "Get all forms with pagination" })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({ status: 200, description: "List of all forms" })
  async getAllForms(
    @Query("page") page?: number,
    @Query("limit") limit?: number
  ) {
    const validPage = page ? page : 1;
    const validLimit = limit ? limit : 10;
    return await this.formService.getAllForms(validPage, validLimit);
  }

  @Get(":cpf")
  @ApiOperation({ summary: "Get form by CPF" })
  @ApiResponse({ status: 200, description: "Form data" })
  @ApiResponse({ status: 404, description: "Form not found" })
  async getFormByCpf(@Param("cpf") cpf: string) {
    return await this.formService.getFormByCpf(cpf);
  }

  @Delete(":cpf")
  @ApiOperation({ summary: "Delete form by CPF" })
  @ApiResponse({ status: 200, description: "Form successfully deleted" })
  @ApiResponse({ status: 404, description: "Form not found" })
  async deleteFormByCpf(@Param("cpf") cpf: string) {
    return await this.formService.deleteFormByCpf(cpf);
  }
}
