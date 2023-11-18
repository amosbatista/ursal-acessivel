- carregar a timeline com o minId
- rodar a timeline 1 vez a cada minuto, informando o minId
  - a partir deste minId, buscar a timeline
- atualizar a timeline com minId
- persistir a minId
- se achar um post com problemas
  - pegar o nome do usuário e a url do post
  - adicionar na fila
    - para cada minuto
      - extrair da fila e postar:
        - "Olá, @usuário, como a acessibilidade é importante para a ${process.env.INSTANCE_NAME}, estou alertando você de que este post não possui uma descrição de conteúdo. 
        É possível você reescrever este conteúdo novamente? Se for, vou agradecer muito!"






processos

- carregar timeline
- carregar última timeline
- postar toot
- salvar última timeline

- carregar última timeline
  - quando carregar: iniciar processo

- processo
  - carregar timeline
    - quando carregar:
      - postar toot
      - salvar timeline
