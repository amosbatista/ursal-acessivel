import { IPost } from "../posts/Post";

interface IStatus {
  status: string,
}

function CreateStatusForNonAcessiblePost (post:IPost): IStatus {
  return {
    status: `Alto lá :policia: \n Com licença, @${post.user.userName}. Vi que este post (${post.url}) tem uma imagem ou vídeo sem descrição.\nComo na Ursal temos muito apreço para abrir as portas para pessoas com deficiência, queria reforçar contigo este acordo de acessibilidade contigo.\nVeja se é possível você editar o seu toot, adicionando descrição nas mídias (caso esteja usando aplicativo), ou tentar colocar as imagens com descrição na resposta deste post? \nMuito obrigado pela atenção e apoio.`
  }
}

export { IStatus, CreateStatusForNonAcessiblePost }