import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Post,
  Query,
} from "@nestjs/common";
import { FormService } from "./form.service";
import { CreateFormDto } from "./dto/create-form.dto";
import { UpdateFormDto } from "./dto/update-form.dto";
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
  @ApiQuery({ name: "page", required: true, type: Number })
  @ApiQuery({ name: "limit", required: true, type: Number })
  @ApiResponse({ status: 200, description: "List of all forms" })
  async getAllForms(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return await this.formService.getAllForms(page, limit);
  }

  @Get(":cpf")
  @ApiOperation({ summary: "Get form by CPF" })
  @ApiResponse({ status: 200, description: "Form data" })
  @ApiResponse({ status: 404, description: "Form not found" })
  async getFormByCpf(@Param("cpf") cpf: string) {
    return await this.formService.getFormByCpf(cpf);
  }

  @Patch(":cpf")
  @ApiOperation({ summary: "Update form by CPF" })
  @ApiBody({ type: UpdateFormDto, description: "Updated form data" })
  @ApiResponse({ status: 200, description: "Form updated successfully" })
  @ApiResponse({ status: 404, description: "Form not found" })
  @ApiResponse({ status: 400, description: "Invalid form data" })
  async updateFormByCpf(
    @Param("cpf") cpf: string,
    @Body() updateFormDto: UpdateFormDto
  ) {
    return await this.formService.updateFormByCpf(cpf, updateFormDto);
  }
}
