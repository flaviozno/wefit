import { BadRequestException, Module, ValidationPipe } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { APP_PIPE } from "@nestjs/core";
import { KeycloakModule } from './modules/keycloak/keycloak.module';
import { FormModule } from './modules/form/form.module';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';

export const extractErrors = (errors) => {
  const result = [];
  for (const error of errors) {
    if (error.children && error.children.length > 0) {
      result.push(...extractErrors(error.children));
    } else if (error.constraints) {
      result.push({
        property: error.property,
        message: Object.values(error.constraints).join(", "),
      });
    }
  }
  return result;
};

@Module({
  imports: [DatabaseModule, KeycloakModule, FormModule, AuthModule],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        stopAtFirstError: true,
        exceptionFactory: (errors) => {
          const extractedErrors = extractErrors(errors);
          if (extractedErrors.length === 0) {
            return new BadRequestException({
              message: "Erro desconhecido",
              success: false,
            });
          }
          const response: any = {
            message: `Erro '${extractedErrors[0]?.property}': ${extractedErrors[0]?.message}`,
            success: false,
          };
          return new BadRequestException(response);
        },
      }),
    },
    AuthService,
  ],
})
export class AppModule {}
