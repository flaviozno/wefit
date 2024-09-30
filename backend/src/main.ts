import { app } from "./app";

const port = process.env.PORT || 3306;

async function bootstrap() {
  (await app()).listen(port, () => {
    console.log(`http://localhost:${port}${process.env.BASE_PATH}/swagger`);
  });
}
bootstrap();
