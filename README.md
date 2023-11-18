# Robô Acessível

Robô escrito em NodeJS para Mastodon que serve para conscientizar usuários da instância sobre o respeito à acessibilidade.

## Como usar

- Execute `npm install` para baixar as dependências do projeto;
- Copie o arquivo `.dev.env` e renomeie para `.env`;
- Edite o arquivo `.env` informando o que se pede;
- Logado com a conta que será usada pelo robô, [visite esta página](https://token.bolha.one/?scopes=read+write) e preencha os campos 1 e 3;
- Cole o código gerado na variável `MASTODON_KEY` no arquivo `.env`;
- Informe a URL da sua instância sem `https://` na variável `INSTANCE_URL`. Exemplo: `"bolha.one"`.;
- Defina o nome da sua instância na variável `INSTANCE_NAME`. Ela será mostrada na mensagem enviada ao usuário que não descrever mídias. Exemplo: `"Bolha.one"`;
- Rode o projeto como `npm run start`;
- Aguarde o robô iniciar, o que pode levar até 3 minutos.

A mensagem que o usuário da instância irá receber ficará assim, baseado nos exemplos acima:

```
Alto lá! :policia: 

Com licença, @JohnMastodon.

Reparei que este post (https://bolha.one/@JohnMastodon/1234567890) tem uma imagem ou vídeo sem descrição. Como na Bolha.one temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.

Por favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.

Muito obrigado por sua compreensão e apoio!
```

## Créditos

O Robô Acessível foi [desenvolvido por Amós Batista](https://github.com/amosbatista/ursal-acessivel/) para a Ursal e posteriormente disponibilizado para uso geral por outros servidores. Este repositório adiciona algumas alterações como mais variáveis de ambiente para substituir os endereços *hardcoded* da Ursal que tinham antes.

Também modifica a mensagem a ser enviada para os usuários que não adicionarem descrição nas mídias.