import * as dotenv from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenv.config();

const options = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE || "",
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true, // false em prod
  logging: process.env.DB_LOG,
  schema: process.env.DB_SCHEMA,
};

export const dataSourceOptions: DataSourceOptions =
  options as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
