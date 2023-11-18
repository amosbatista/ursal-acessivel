import { IPost } from "../posts/Post";

interface IStatus {
  status: string,
}

function CreateStatusForNonAcessiblePost (post:IPost): IStatus {
  return {
    status: `Alto lá! :policia: \n\nCom licença, @${post.user.userName}.\n\nReparei que este post (${post.url}) tem uma imagem ou vídeo sem descrição. Como na ${process.env.INSTANCE_NAME} temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.\n\nPor favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.\n\nMuito obrigado por sua compreensão e apoio!`
  }
}

export { IStatus, CreateStatusForNonAcessiblePost }