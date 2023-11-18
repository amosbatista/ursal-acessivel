# Robô Acessível

Robô escrito em NodeJS para Mastodon que serve para conscientizar usuários da instância sobre o respeito à acessibilidade.

## Como usar

- Execute `npm install` para baixar as dependências do projeto;
- Copie o arquivo `.dev.env` e renomeie para `.env`;
- Edite o arquivo `.env` informando o que se pede:
    - Logado com a conta que será usada pelo robô, [visite esta página](https://token.bolha.one/?client_name=Rob%C3%B4+Acess%C3%ADvel&scopes=read+write) e preencha o terceiro campo;
    - Cole o código gerado no link acima na variável `MASTODON_KEY` do arquivo `.env`;
    - Informe, dentro das aspas, a URL da sua instância (sem `https://`) na variável `INSTANCE_URL`. Exemplo: `"bolha.one"`.;
    - Defina, dentro das aspas, o nome da sua instância na variável `INSTANCE_NAME`. Exemplo: `"Bolha.one"`;
    - Na variável `DM_MSG` você define, também dentro das aspas duplas, a mensagem que será enviada aos usuários notificados. Você pode incluir atalhos de `:emojis:` e também quebras de linha (`\\n`).
- Execute o projeto com `npm run start`;
- Aguarde o robô iniciar, o que pode levar até três minutos.

Exemplo de arquivo `.env`:

```
MASTODON_KEY=3JZ68k2bjbIEBWzMfs8G0vfc7dJDSnhkSqrgs0n2vPddP5UIjmztOJTAbaQD8YT
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

## Créditos

O Robô Acessível foi [desenvolvido por Amós Batista](https://github.com/amosbatista/ursal-acessivel/) para a Ursal e posteriormente disponibilizado para uso geral por outros servidores. Este fork realiza algumas alterações como mais variáveis de ambiente para substituir os endereços *hardcoded* da Ursal que tinham antes.

Também modifica a mensagem a ser enviada para os usuários que não adicionarem descrição nas mídias.

## Licença

Este software está sob a licença MIT.

```
 The MIT License (MIT)

Copyright © 2023 Amós Batista

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```