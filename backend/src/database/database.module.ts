import { Module, Global } from "@nestjs/common";
import { dataSourceOptions } from "./database.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_FILTER } from "@nestjs/core";
import { DatabaseFilter } from "./database.filter";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...dataSourceOptions,
      }),
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DatabaseFilter,
    },
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
