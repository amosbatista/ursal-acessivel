import { IPost } from "../posts/Post";

interface IStatus {
  status: string,
}

function CreateStatusForNonAcessiblePost (post:IPost): IStatus {
  return {
    status: `Oie, @${post.user.userName}. Vi que este post (${post.url}) tem uma imagem ou vídeo sem descrição. 
    Como na Ursal temos muito apreço para abrir as portas para pessoas com deficiência, queria reforçar contigo este acordo de acessibilidade contigo. 
    É possível você repostar o conteúdo deste seu toot, desta vez com descrição? 
    Muito obrigado pela atenção e apoio!`
  }
}

export { IStatus, CreateStatusForNonAcessiblePost }