import { Test, TestingModule } from "@nestjs/testing";
import { FormController } from "./form.controller";
import { FormService } from "./form.service";
import { CreateFormDto } from "./dto/create-form.dto";

describe("FormController", () => {
  let controller: FormController;
  let formService: FormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        {
          provide: FormService,
          useValue: {
            createForm: jest.fn(),
            getAllForms: jest.fn(),
            getFormByCpf: jest.fn(),
            deleteFormByCpf: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FormController>(FormController);
    formService = module.get<FormService>(FormService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createForm", () => {
    it("should call formService.createForm with correct data", async () => {
      const createFormDto: CreateFormDto = {
        type: "FISICA",
        cnpj: "12.345.678/0001-90",
        cpf: "123.456.789-00",
        name: "John Doe",
        phone: "(11) 2345-6789",
        mobile: "(11) 91234-5678",
        email: "john.doe@example.com",
        emailConfirmation: "john.doe@example.com",
        addresses: [
          {
            cep: "12345-678",
            street: "Main Street",
            city: "New York",
            state: "NY",
            number: "0",
            complement: "Home",
            district: "Some One",
          },
        ],
        termsAccepted: true,
      };
      await controller.createForm(createFormDto);
      expect(formService.createForm).toHaveBeenCalledWith(createFormDto);
    });
  });

  describe("getAllForms", () => {
    it("should call formService.getAllForms with correct pagination parameters", async () => {
      const page = 1;
      const limit = 10;
      await controller.getAllForms(page, limit);
      expect(formService.getAllForms).toHaveBeenCalledWith(page, limit);
    });

    it("should call formService.getAllForms with default parameters when not provided", async () => {
      await controller.getAllForms();
      expect(formService.getAllForms).toHaveBeenCalledWith(1, 10);
    });
  });

  describe("getFormByCpf", () => {
    it("should call formService.getFormByCpf with correct CPF", async () => {
      const cpf = "12345678900";
      await controller.getFormByCpf(cpf);
      expect(formService.getFormByCpf).toHaveBeenCalledWith(cpf);
    });
  });

  describe("deleteFormByCpf", () => {
    it("should call formService.deleteFormByCpf with correct CPF", async () => {
      const cpf = "12345678900";
      await controller.deleteFormByCpf(cpf);
      expect(formService.deleteFormByCpf).toHaveBeenCalledWith(cpf);
    });
  });
});
