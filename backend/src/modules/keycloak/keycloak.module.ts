import { Module, Global } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import {
  AuthGuard,
  ResourceGuard,
  RoleGuard,
  KeycloakConnectModule,
} from "nest-keycloak-connect";

@Global()
@Module({
  exports: [],
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_ID,
      secret: process.env.KEYCLOAK_SECRET,
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class KeycloakModule {}
