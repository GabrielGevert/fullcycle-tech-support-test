
## Desafio Docker

O objetivo desse desafio é que ao executar `docker compose up` tudo deve ser criado por completo e os containers precisam depender um do outro para subirem.

Este projeto base possui diversos erros de Docker, por isso os ajustes estão apenas nos arquivos:
- Dockerfile
- docker-compose.yaml

Analise os dois arquivos, verifique o que está impedindo a execução dos containers e faça o fix necessário.

---

### Correção do desafio:

Para verificar se está tudo funcionando, você deverá rodar o projeto via docker-compose e posteriomente acessar o seu ambiente local:

Rode o comando:

```bash
docker compose up
```

Acesse a rota abaixo e uma lista de nomes deve ser impressa na tela:

```
localhost:8080
```

## Explicação de resolução:

- O primeiro problema identificado, foi no **dockerfile**, o qual estava faltando comandos necessários.

- O segundo problema identificado, foi no **docker compose** o qual estava faltando diversos paramêtros para os containers.

### Solução:
- No seu **dockerfile**, para salvar as depêndencias, primeiro você deve copiar os diretórios de seus pacotes e rodar um npm install, depois disso, você deve iniciar com o nodemon e o ts, para conseguir utilizar corretamente as depêndencias do projeto.

- No seu **docker compose**, você deve atualizar os parâmetros de cada container.

### Exemplo:
No exemplo abaixo, irei te mostrar as alterações necessárias.

```Dockerfile
# Dockerfile
WORKDIR /usr/src/app

# Copiar os arquivos de de pacote com as depêndencias necessárias.
COPY package.json package-lock.json ./

# Instalar as dependências listadas
RUN npm install

# Copia todos os outros arquivos do diretório atual para o diretório de trabalho do container.
COPY . .

# Expõe a porta 3000 do container para que possa ser acessada externamente.
EXPOSE 3000

# Comando para iniciar o aplicativo com nodemon
# nodemon monitora mudanças nos arquivos e reinicia o servidor automaticamente
# ts-node é usado para executar arquivos TypeScript diretamente
CMD ["npx", "nodemon", "--watch", "./", "--exec", "npx ts-node ./server.ts", "-e", "ts"]
```
***

```yaml
#docker-compose
version: '3'

services:
  app:
    build:
      context: ./app  # Define o diretório onde o Dockerfile está localizado para construir a imagem do serviço 'app'.
      dockerfile: Dockerfile  # Especifica o nome do Dockerfile a ser usado na construção da imagem.
    container_name: app
    tty: true
    volumes:
      - ./app:/usr/src/app  # Monta o diretório local './app' no diretório '/usr/src/app' do container para sincronizar os arquivos.
      - /usr/src/app/node_modules  # Monta um volume 'anônimo' para '/usr/src/app/node_modules' para preservar e evidenciar as dependências instaladas durante o desenvolvimento.
    depends_on:
      - database  # Define que o serviço 'app' deve esperar que o serviço 'database' esteja iniciado antes de iniciar.
    healthcheck: # O healthcheck serve para verificar se está tudo ok, de acordo com os parâmetros passados dentro dele.
      test: ["CMD-SHELL", "curl -f http://localhost:3000 || exit 1"]  # Comando para verificar a saúde do container, usa 'curl' para garantir que o serviço na porta 3000 está respondendo.
      interval: 30s  # Intervalo entre verificações de saúde do container.
      timeout: 10s  # Tempo máximo que o teste de saúde pode levar para ser concluído.
      retries: 3  # Número de vezes que o teste de saúde pode falhar antes de considerar o container como não saudável.
      start_period: 5s  # Tempo inicial após o início do container antes de iniciar as verificações de saúde.

  nginx:
    image: nginx:latest
    container_name: nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "8080:80"
    depends_on:
      - app

  database:
    image: mysql:5.7
    command: --innodb-use-native-aio=0
    container_name: database
    restart: always
    tty: true
    volumes:
      - mysql:/var/lib/mysql
    environment:
      - MYSQL_DATABASE=nodedb
      - MYSQL_ROOT_PASSWORD=root

volumes:
  mysql:
    driver: local
```
