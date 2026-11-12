# Robô Acessível

_Social buttons_

[![amosbatista - ursal-acessivel](https://img.shields.io/static/v1?label=amosbatista&message=ursal-acessivel&color=red&logo=github)](https://github.com/amosbatista/ursal-acessivel "Go to GitHub repo")
[![stars - ursal-acessivel](https://img.shields.io/github/stars/amosbatista/ursal-acessivel?style=social)](https://github.com/amosbatista/ursal-acessivel)
[![forks - ursal-acessivel](https://img.shields.io/github/forks/amosbatista/ursal-acessivel?style=social)](https://github.com/amosbatista/ursal-acessivel)


_Repo metadata_

[![GitHub tag](https://img.shields.io/github/tag/amosbatista/ursal-acessivel?include_prereleases=&sort=semver&color=red)](https://github.com/amosbatista/ursal-acessivel/releases/)
[![License](https://img.shields.io/badge/License-MIT-red)](#license)
[![issues - ursal-acessivel](https://img.shields.io/github/issues/amosbatista/ursal-acessivel)](https://github.com/amosbatista/ursal-acessivel/issues)

[![coverage - 86,78%](https://img.shields.io/static/v1?label=coverage&message=72%2C34%&color=2ea44f)](https://)

## License
Released under [MIT](/LICENSE) by [@amosbatista](https://github.com/amosbatista).

Robô escrito em NodeJS para Mastodon que serve para conscientizar usuários da instância sobre o respeito à acessibilidade.
## Como usar

- Execute `npm install` para baixar as dependências do projeto;
- Copie o arquivo `.dev.env` e renomeie para `.env`;
- Edite o arquivo `.env` informando o que se pede:
    - Informe, dentro das aspas, a URL da sua instância (sem `https://`) na variável `INSTANCE_URL`. Exemplo: `"bolha.one"`.;
    - Defina, dentro das aspas, o nome da sua instância na variável `INSTANCE_NAME`. Exemplo: `"Bolha.one"`;
    - Na variável `DM_MSG` você define, também dentro das aspas duplas, a mensagem que será enviada aos usuários notificados. Você pode incluir atalhos de `:emojis:` e também quebras de linha (`\\n`).
- Execute `npm run mastodon:auth` antes da primeira inicialização;
- Abra no navegador a URL exibida pelo comando, entre com a conta usada pelo robô e autorize o acesso;
- Copie o código exibido pelo Mastodon e cole-o no terminal. O token será validado e salvo em `data/mastodon-auth.json`;
- Execute o projeto com `npm run start`;
- Aguarde o robô iniciar, o que pode levar até três minutos.

O arquivo `data/mastodon-auth.json` contém segredos equivalentes a uma senha. Ele não deve ser versionado, compartilhado ou incluído na imagem Docker. Se o acesso for revogado no Mastodon, execute `npm run mastodon:auth` novamente.

Exemplo de arquivo `.env`:

```
INSTANCE_URL="bolha.one"
INSTANCE_NAME="Bolha.one"
DM_MSG="Alto lá! :policia: \\n\\nCom licença, @${post.user.userName}.\\n\\nReparei que este post (${post.url}) tem uma imagem ou vídeo sem descrição. Como na ${process.env.INSTANCE_NAME} temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.\\n\\nPor favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.\\n\\nMuito obrigado por sua compreensão e apoio!"
```

Sobre a mensagem a ser enviada por menção direta, preste atenção nas variáveis caso altere o texto:

- `@${post.user.userName}`: será substituído pelo nome de usuário da pessoa. Exemplo: `@JohnMastodon`;
- `${post.url}`: será substituído pelo endereço do toot sem descrição de mídias;
- `${process.env.INSTANCE_NAME}`: será substituído pelo nome da instância que você definiu no `.env`.

A mensagem que o usuário da instância irá receber ficará assim, baseado nos exemplos acima:

```
Alto lá! :policia: 

Com licença, @JohnMastodon.

Reparei que este post (https://bolha.one/@JohnMastodon/1234567890) tem uma imagem ou vídeo sem descrição. Como na Bolha.one temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.

Por favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.

Muito obrigado por sua compreensão e apoio!
```

## Usando com o Docker

Você dockerizar a execução do bot. Para isso, use a imagem `acessivel:latest` de nosso repositório.

``` bash
docker run -d \
    -e PYTHONUNBUFFERED=true \
    -e INSTANCE_URL=botsin.space \
    -e INSTANCE_NAME=Bolha.one \
    -e DM_MSG="Alto lá! :policia: \\n\\nCom licença, @${post.user.userName}.\\n\\nReparei que este post (${post.url}) tem uma imagem ou vídeo sem descrição. Como na ${process.env.INSTANCE_NAME} temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.\\n\\nPor favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.\\n\\nMuito obrigado por sua compreensão e apoio!" \
    -e TZ=America/Recife \
    -v /data/acessivel:/usr/app/acessivel/data \
    --name mastofm \
    --restart unless-stopped \
    code.bolha.one/bolha/acessivel:latest
```

Antes de subir o serviço pela primeira vez, autentique a conta usando o mesmo volume persistente:

```bash
docker run --rm -it \
    -e INSTANCE_URL=botsin.space \
    -v /data/acessivel:/usr/app/acessivel/data \
    code.bolha.one/bolha/acessivel:latest \
    npm run mastodon:auth
```

Informe `INSTANCE_URL`, `INSTANCE_NAME` e `DM_MSG` como faria no arquivo `.env`. O volume `/data/acessivel:/usr/app/acessivel/data` precisa estar presente tanto no comando de autenticação quanto no serviço normal. Se preferir, edite e use o arquivo `docker-compose.yml` com o Portainer Stacks ou `docker-compose up -d`.

## Créditos

O Robô Acessível foi [desenvolvido por Amós Batista](https://github.com/amosbatista/ursal-acessivel/) para a Ursal e posteriormente disponibilizado para uso geral por outros servidores. Este fork realiza algumas alterações como mais variáveis de ambiente para substituir os endereços *hardcoded* da Ursal que tinham antes.

Também modifica a mensagem a ser enviada para os usuários que não adicionarem descrição nas mídias.

## Licença

Este software está sob a licença MIT, conforme arquivo `LICENSE`.
