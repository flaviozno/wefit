import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FormController } from "./form.controller";
import { FormService } from "./form.service";
import { User } from "../../entity/user.entity";
import { Address } from "../../entity/address.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Address])],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
