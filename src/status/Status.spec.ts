import { IPost } from '../posts/Post';
import { CreateStatusForNonAcessiblePost, IStatus } from './Status'

describe('Status test', () => {
  it('must receive a Post and return a formated status', () => {
    const post:IPost = {
      content: "foo",
      id: "1",
      url: "https://ursal.zone/users/teste/statuses/123445",
      user: {
        id: "1",
        userName: "foo"
      },
      media: [{
        id: "1",
        description: "",
        type: "",
        url: "https://ursal.zone/users/teste/statuses/123445"
      }]
    }


    const expected: IStatus = {
      status:  `Oie, foo. Vi que este post (https://ursal.zone/users/teste/statuses/123445) tem uma imagem ou vídeo sem descrição. 
      Como na Ursal temos muito apreço para abrir as portas para pessoas com deficiência, queria reforçar contigo este acordo de acessibilidade contigo. 
      É possível você repostar o conteúdo deste seu toot, desta vez com descrição? 
      Muito obrigado pela atenção e apoio.`
    }

    expect(CreateStatusForNonAcessiblePost(post)).toEqual(expected);
  });
});