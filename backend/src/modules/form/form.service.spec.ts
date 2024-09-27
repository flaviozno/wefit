import { Test, TestingModule } from "@nestjs/testing";
import { FormService } from "./form.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../../entity/user.entity";
import { Address } from "../../entity/address.entity";
import { CreateFormDto } from "./dto/create-form.dto";
import { BadRequestException } from "@nestjs/common";
import { validateCPF, validateEmail, normalizePhone } from "../../utils";

jest.mock("../../utils", () => ({
  validateCPF: jest.fn(),
  validateEmail: jest.fn(),
  normalizePhone: jest.fn(),
}));

describe("FormService", () => {
  let service: FormService;
  let userRepository: Repository<User>;
  let addressRepository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Address),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FormService>(FormService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    addressRepository = module.get<Repository<Address>>(
      getRepositoryToken(Address)
    );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createForm", () => {
    it("should create a new form successfully", async () => {
      const createFormDto: CreateFormDto = {
        type: "FISICA",
        cnpj: "12.345.678/0001-90",
        cpf: "37459756857",
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

      const createdUser = {
        type: 'FISICA',
        cnpj: '12.345.678/0001-90',
        cpf: '37459756857',
        name: 'John Doe',
        phone: '+551123456789',
        mobile: '+5511912345678',
        email: 'john.doe@example.com',
        emailConfirmation: 'john.doe@example.com',
        termsAccepted: true
      };

      const savedUser = {
        type: 'FISICA',
        cnpj: '12.345.678/0001-90',
        cpf: '37459756857',
        name: 'John Doe',
        phone: '+551123456789',
        mobile: '+5511912345678',
        email: 'john.doe@example.com',
        emailConfirmation: 'john.doe@example.com',
        termsAccepted: true,
        id: 1,
        createdAt: '2024-09-28T01:29:36.706Z',
        updatedAt: '2024-09-28T01:29:36.706Z'
      }

      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);
      jest
        .spyOn(userRepository, "create")
        .mockReturnValueOnce(createdUser as any);
      jest
        .spyOn(userRepository, "save")
        .mockResolvedValueOnce(savedUser as any);

      (validateCPF as jest.Mock).mockReturnValueOnce(true);
      (validateEmail as jest.Mock).mockReturnValueOnce(true);
      (normalizePhone as jest.Mock).mockImplementation((phone) => phone);

      const result = await service.createForm(createFormDto);
      expect(result).toEqual(savedUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createFormDto.email },
      });
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createFormDto.email,
          cpf: createFormDto.cpf,
        })
      );
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    });

    it("should throw an error if email is already in use", async () => {
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

      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValueOnce(createFormDto as any);

      await expect(service.createForm(createFormDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it("should throw an error if CPF is invalid", async () => {
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

      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);
      (validateCPF as jest.Mock).mockReturnValueOnce(false);

      await expect(service.createForm(createFormDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("getFormByCpf", () => {
    it("should return a form by CPF", async () => {
      const mockUser = { cpf: "123.456.789-00", name: "John Doe" };
      jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValueOnce(mockUser as any);

      const result = await service.getFormByCpf("123.456.789-00");
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if form is not found", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValueOnce(null);

      await expect(service.getFormByCpf("123.456.789-00")).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
