import * as dotenv from "dotenv";
dotenv.config();

import { AppModule } from "./app.module";

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { NestFactory } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";

export async function app(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(process.env.BASE_PATH);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("WeFit - Desafio")
    .setDescription(`Essa api usa o KeyCloak para gerar os tokens`)
    .setVersion("1.0")
    .addBearerAuth({
      type: "http",
      in: "header",
      scheme: "Bearer",
      bearerFormat: "token",
      name: "Authorization",
    } as SecuritySchemeObject)
    .addServer(process.env.BASE_URL)
    .addServer("http://localhost:3000", "localhost")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.SWAGGER_PATH, app, document);
  SwaggerModule.setup(
    `${process.env.BASE_PATH}/${process.env.SWAGGER_PATH}`,
    app,
    document
  );

  return app;
}
