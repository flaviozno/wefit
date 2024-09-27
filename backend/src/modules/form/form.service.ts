import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../entity/user.entity";
import { Address } from "../../entity/address.entity";
import { CreateFormDto } from "./dto/create-form.dto";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateFormDto } from "./dto/update-form.dto";
import { validateEmail, validateCPF, normalizePhone } from "../../utils";

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>
  ) {}

  async createForm(createFormDto: CreateFormDto): Promise<User> {
    const {
      addresses,
      email,
      emailConfirmation,
      cpf,
      phone,
      mobile,
      ...userData
    } = createFormDto;

    try {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUser) {
        throw new BadRequestException({
          message: "This email is already in use",
          success: false,
        });
      }

      if (!validateCPF(cpf)) {
        throw new BadRequestException({
          message: "You cpf is invalid",
          success: false,
        });
      }

      if (!validateEmail(email, emailConfirmation)) {
        throw new BadRequestException({
          message: "You emailConfirmation is not the same",
          success: false,
        });
      }

      const normalizedPhone = normalizePhone(phone);
      const normalizedMobile = normalizePhone(mobile);

      const user = this.userRepository.create({
        ...userData,
        email,
        cpf,
        emailConfirmation: email,
        mobile: normalizedMobile,
        phone: normalizedPhone,
      });

      const savedUser = await this.userRepository.save(user);

      const addressPromises = addresses.map((address: CreateAddressDto) => {
        const newAddress = this.addressRepository.create({
          ...address,
          user: savedUser,
        });
        return this.addressRepository.save(newAddress);
      });

      await Promise.all(addressPromises);

      return savedUser;
    } catch (error) {
      throw new BadRequestException({
        message: `An error occurred while processing your request: ${error.message || error}`,
        success: false,
      });
    }
  }

  async getAllForms(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const [users, total] = await this.userRepository.findAndCount({
        skip,
        take: limit,
        relations: ["addresses"],
      });

      return {
        data: users,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException({
        message: "Error for get forms",
        success: false,
      });
    }
  }

  async getFormByCpf(cpf: string) {
    try {
      const form = await this.userRepository.findOne({
        where: { cpf },
        relations: ["addresses"],
      });
      if (!form) {
        throw new BadRequestException({
          message: "Theres no form created yet!",
          success: false,
        });
      }
      return form;
    } catch (error) {
      throw new BadRequestException({
        message: "Error for get this form",
        success: false,
      });
    }
  }

  async updateFormByCpf(cpf: string, updateFormDto: UpdateFormDto) {
    const result = await this.userRepository.update({ cpf }, updateFormDto);

    try {
      if (result.affected === 0) {
        throw new BadRequestException({
          message: "Error for update this form",
          success: false,
        });
      }

      const updatedUser = await this.userRepository.findOne({
        where: { cpf },
        relations: ["addresses"],
      });

      return { message: "Form updated successfully", form: updatedUser };
    } catch (error) {
      throw new BadRequestException({
        message: "Error for update this form",
        success: false,
      });
    }
  }
}
