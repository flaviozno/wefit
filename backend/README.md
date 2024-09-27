## Backend - Wefit | Respota

O teste foi resolvido usando **Nest.js**. Existe uma rota **/swagger** que necessita de autorização que é feita via token gerado por um **Keyclaok** que foi configurado no mesmo **docker-compose.yml**

### Para iniciar o banco de dados  e o Keycloak é necessario ter o docker-compose instalado em sua máquina e rodar o seguinte comando:

    docker-compose up -D

o docker-compose vai criar um container de um MySQL e você poderá acessar via localhost:3306 e a senha do usuário **root** é **senha_root_123** e o Keycloak vai subir em localhost:8080 e a senha é **admin** e **admin** o usuário.

### Para iniciar o servidor express basta executar o seguinte comando:

    npm run start:dev
    ou
    yarn start:dev


### Geração do token
O token pode ser gerado via collection do postman que esta no repositório. Basta pegar o **access_tooken** e adicionar ele swagger para desbloquear as consultas.

O tempo de duração de cada token é de **300ms** ou **5 minutos**

### Foi usado no core:
- typeorm
- swagger
- keyclaok
- nest.js
- typescript
