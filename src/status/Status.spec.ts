import { IPost } from '../posts/Post';
import { CreateStatusForNonAcessiblePost, IStatus } from './Status'

describe('Status test', () => {
  it('must receive a Post and return a formated status', () => {
    const post:IPost = {
      content: "foo",
      id: "1",
      url: "https://${process.env.INSTANCE_URL}/users/teste/statuses/123445",
      user: {
        id: "1",
        userName: "foo"
      },
      creationData: '2023-02-17T19:47:15.598Z',
      media: [{
        id: "1",
        description: "",
        type: "",
        url: "https://${process.env.INSTANCE_URL}/users/teste/statuses/123445"
      }]
    }


    const expected: IStatus = {
      status: `Oie, @foo. Vi que este post (https://${process.env.INSTANCE_URL}/users/teste/statuses/123445) tem uma imagem ou vídeo sem descrição.\nComo na ${process.env.INSTANCE_NAME} temos muito apreço para abrir as portas para pessoas com deficiência, queria reforçar contigo este acordo de acessibilidade contigo.\nÉ possível você repostar o conteúdo deste seu toot, desta vez com descrição?\nMuito obrigado pela atenção e apoio.`
    }

    expect(CreateStatusForNonAcessiblePost(post)).toEqual(expected);
  });
});