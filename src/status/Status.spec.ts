import { IPost } from '../posts/Post';
import { CreateStatusForNonAcessiblePost, IStatus } from './Status'

describe('Status test', () => {

  it('must receive a Post and return a formated status', () => {

    process.env.NODE_ENV = 'dev';
    process.env.MASTODON_KEY = 'foo';
    process.env.INSTANCE_URL='ursal.zone';
    process.env.INSTANCE_NAME="ursal"
    process.env.DM_MSG="Alto lá! :policia: \\n\\nCom licença, @${post.user.userName}.\\n\\nReparei que este post (${post.url}) tem uma imagem ou vídeo sem descrição. Como na ${process.env.INSTANCE_NAME} temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.\\n\\nPor favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.\\n\\nMuito obrigado por sua compreensão e apoio!"

    const post:IPost = {
      content: "foo",
      id: "1",
      url: `https://${process.env.INSTANCE_URL}/users/teste/statuses/123445`,
      user: {
        id: "1",
        userName: "@foo"
      },
      creationData: '2023-02-17T19:47:15.598Z',
      media: [{
        id: "1",
        description: "",
        type: "",
        url: `https://${process.env.INSTANCE_URL}/users/teste/statuses/123445`
      }]
    }


    const expected: IStatus = {
      status: `Alto lá! :policia: \\n\\nCom licença, ${post.user.userName}.\\n\\nReparei que este post (${post.url}) tem uma imagem ou vídeo sem descrição. Como na ${process.env.INSTANCE_NAME} temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.\\n\\nPor favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.\\n\\nMuito obrigado por sua compreensão e apoio!`,
      visibility: 'direct'
    }

    expect(CreateStatusForNonAcessiblePost(post)).toEqual(expected);
  });
});