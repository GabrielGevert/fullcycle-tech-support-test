
## Desafio Golang

O objetivo deste desafio é que ao executar os testes já criados, todos devem passar com êxito. Analise os arquivos do projeto, os arquivos de configuração e faça o fix necessário.

### Restrições
- A versão do `Golang` deve ser mantida a `1.16`.
- As libs já presentes devem permanecer as mesmas
- Você poderá trocar as versões das libs já presentes

### Correção do desafio:
Para verificar se está tudo funcionando, você deverá rodar o projeto segundo os passos abaixo:

Rode o container do projeto:

```bash
docker compose up
```

Entre no container:

```bash
docker compose exec app bash
```

Instale as dependências:

```bash
go mod tidy
```

Rode os testes:

```bash
go test ./....
```

O output esperado é a execução de todos os testes sem nenhum tipo de erro.

## Explicação de resolução:

- O primeiro problema identificado, foi ao rodar o go mod tidy, verifiquei que pelo código estava importando do coodeedu/go-hexagonal um código que é **PRIVADO**, você poderia acessar o código se esta fosse **sua** conta do GITHUB ou se você tivesse acesso ao repositório.

- O segundo problema identificado, foi **MÓDULO** no go.mod, geralmente o módulo é o **próprio** repositório de onde você está trabalhando.

- O terceiro e último problema identificado foi a versão do **Testify**, ao rodar o go test ./... ele solicita o **go 1.17**.

### Solução:
- Uma abordagem eficiente seria trocar **todos** os imports para algum que você tivesse acesso (neste caso, preferi upar todo o repositório para minha própria conta e alterar todos os imports). Outra abordagem útil, dependendo do contexto, seria você solicitar acesso ao repositório.

- Trocar o **MÓDULO** no go.mod.

- Trocar a **versão** do Testify no go.mod.

### Exemplo:
No exemplo abaixo, irei te mostrar as alterações necessárias.

```go
// go.mod
module github.com/GabrielGevert/fullcycle-tech-support-test/desafio-golang
// modifique o link do módulo para onde está o seu go.mod

go 1.16

require (
	github.com/asaskevich/govalidator v0.0.0-20210307081110-f21760c49a8d
	github.com/codegangsta/negroni v1.0.0
	github.com/golang/mock v1.5.0
	github.com/gorilla/mux v1.8.0
	github.com/mattn/go-sqlite3 v1.14.16
	github.com/mitchellh/go-homedir v1.1.0
	github.com/satori/go.uuid v1.2.0
	github.com/spf13/cobra v1.8.0
	github.com/spf13/viper v1.7.1
	github.com/stretchr/testify v1.7.0
// modifique a versão do testify para 1.7.0, pois é a correta para o go 1.16.
)
```

## Exemplo de import:

```go
// main.go
/*
Copyright © 2021 NAME HERE <EMAIL ADDRESS>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package main

import "github.com/GabrielGevert/fullcycle-tech-support-test/desafio-golang/cmd"
/// modifique o import. Tenha atenção que aqui ele solicita o CMD, então toque para onde está a sua pasta CMD. Outros imports pedem outras pastas.
func main() {
	cmd.Execute()
}
```
