import { Injectable } from "@nestjs/common";
import { KeycloakConnectModule } from "nest-keycloak-connect";

@Injectable()
export class KeycloakService {
  constructor() {
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_URL,
      realm: process.env.KEYCLOAK_REALM,
      clientId: process.env.KEYCLOAK_ID,
      secret: process.env.KEYCLOAK_SECRET,
    });
  }
}
