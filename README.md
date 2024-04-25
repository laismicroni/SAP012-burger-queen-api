https://app.swaggerhub.com/apis-docs/ssinuco/BurgerQueenAPI/3.0.0
# REST API para Gerenciamento de Restaurante  
  
Esta é uma API REST desenvolvida para um restaurante com funcionalidades de cadastro de usuários, clientes, produtos e pedidos. Foi construída utilizando Node.js, MongoDB e Docker, com o framework Express.js. O principal objetivo deste projeto foi adquirir familiaridade com conceitos fundamentais de desenvolvimento web, tais como rotas, URLs, protocolo HTTP, JSON, autenticação JWT, conexão com banco de dados MongoDB, variáveis de ambiente e implantação.  
  
## Tecnologias Utilizadas  
  
![NodeJs](https://img.shields.io/badge/Hashnode-2962FF?style=for-the-badge&logo=hashnode&logoColor=white)  
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)  
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)  
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)  
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)  
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)  
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)  
  
## Propósito da API
  
A API REST foi desenvolvida com o propósito de fornecer um sistema de gerenciamento para um restaurante, permitindo o cadastro de usuários, clientes, produtos e pedidos. A documentação da API, conforme especificada no Swagger disponível [aqui](https://app.swaggerhub.com/apis-docs/ssinuco/BurgerQueenAPI/3.0.0), define os endpoints e operações HTTP esperadas para interagir com a API.
  
### Solicitações HTTP Esperadas  
  
A API expõe os seguintes endpoints e operações HTTP:  
  
- `GET`  
- `POST`  
- `PATCH`  
- `DELETE`  
  
### Comportamento Esperado  
  
O comportamento esperado da API segue as diretrizes especificadas no Swagger. Por exemplo, ao enviar uma solicitação `POST` para o endpoint `/users`, espera-se que a API crie um novo usuário com os dados fornecidos no corpo da solicitação e retorne os detalhes do usuário recém-criado juntamente com um código de status HTTP apropriado.  
É importante consultar a documentação do Swagger para entender completamente o comportamento esperado de cada endpoint e operação.  
Para obter detalhes adicionais sobre como usar a API, consulte a documentação completa fornecida no Swagger.  
  
## Implantação  
  
O projeto foi implantado na plataforma Vercel para disponibilização pública e fácil acesso aos serviços oferecidos pela API.  
  
## Contribuição  
  
Contribuições são bem-vindas! Sinta-se à vontade para propor melhorias, correções de bugs ou novas funcionalidades através de pull requests.  
  
## Utilização  
  
Para iniciar a aplicação, utilize o comando `npm start`. É possível configurar informações como a porta a ser escutada e o banco de dados a ser conectado através de variáveis de ambiente.  
  
```bash
# Inicia a aplicação na porta 8888 usando npm
npm start
