### Desafio Node.js + MySQL

O objetivo desse desafio é que ao rodar o comando `docker compose up` a aplicação `node` deve funcionar por completa. Investigue os arquivos do projeto, os arquivos de configuração e faça o fix necessário.

### Restrições
- A versão do `Node.js` deve ser mantida
- As libs já presentes devem permanecer as mesmas
- Você poderá trocar as versões das libs já presentes

---

### Correção do desafio:
Para verificar se está tudo funcionando, você deverá rodar o projeto segundo os passos abaixo:

Rode o comando:

```bash
docker compose up
```

Acesse a rota abaixo e uma lista de nomes deve ser impressa na tela:

```
localhost:8080
```

***

## Explicação de resolução:

- O primeiro problema identificado, foi no **docker compose**, com a falta do volume dos modulos para o app, a condição *service_healthy* com erro de declaração e banco de dados com nome já usado.

- O segundo problema identificado, foi no **Dockefile**, o qual estava com comandos faltantes.

- O terceiro problema identificado, foi a **autenticação** com o banco de dados, o qual o mysql utilizado não estava suportando o protocolo.

- O quarto problema identificado, foi no **index.js**, o qual não estava criando o banco de dados e a tabela, além da função listPeople estar incorreta.

### Solução:
- No dockerfile adicionei os seguintes comandos:

```Dockerfile
# Dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./ # Utilizado para copiar as depêndencias do projeto.

RUN npm install && npm update # Utilizado para instalar e atualizar as depêndencias do projeto.

COPY . . # Utilizado para copiar o restante dos arquivos do projeto.

EXPOSE 3000

CMD ["node", "index.js"] # Utilizado para rodar o node e especificando o index.js
```

***

- No docker-compose fiz as seguintes alterações:

```yaml
# docker-compose
# no app, adicionado o volume dos módulos e alterada a condição dele.

volumes:
      - ./node:/usr/src/app
      - /usr/src/app/node_modules
###############
 depends_on:
      database:
        condition: service_healthy
##############

# no nginx, editado o nome do banco de dados:
environment:
      - MYSQL_DATABASE=databasenode
      - MYSQL_ROOT_PASSWORD=root
```

***

- No index.js, criada a função para criar a tabela e a função de listar nomes.

```javascript
// index.js
function createTable(connection) {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `;
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
        console.log("Tabela 'people' foi criada ou já existia.");
      }
    });
  });
}

createTable(connection)
  .then(() => sqlInsert(connection))
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });

const listPeople = async () => {
  const allPeople = await sqlSelect(connection);
  console.log(allPeople);
  return allPeople;
};

```

***

## Alterar a autenticação do mysql:

- Primeiro, é necessário acessar o container database, você pode ir pelo exec no docke client ou fazer isso pelo terminal dentro do seu vscode. Para acess seu container pelo terminal rode o seguinte comando:

```bash
docker exec -it database
```

- Dentro do container, rode o seguinte comando:

```bash
mysql -u root -p
```

- Ele vai solicitar a senha, digite root (se esta for sua senha, que é a padrão), mesmo que nao apareça nada.

- Agora rode o seguinte comando para alterar a forma de autenticação (Coloque root em 'seu_usuario' e 'sua_senha' por padrão): 

```bash
ALTER USER 'seu_usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
```
- Se o comando não funcionar utilizando localhost, refaça ele utilizando "@" no lugar.

- Aperte enter e em seguida coloque o seguinte comando: 
```bash
FLUSH PRIVILEGES;
```
- Em seguida, digite exit para sair do banco de dados e rode novamente o projeto.
