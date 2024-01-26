import { Timeline, ITimeline } from './Timeline';

describe("timeline test", () => {

  it("must send a list of posts without description", () => {

    process.env.NODE_ENV = 'dev';
    process.env.MASTODON_KEY = 'foo';
    process.env.INSTANCE_URL='ursal.zone';
    process.env.INSTANCE_NAME="ursal"
    process.env.DM_MSG="Alto lá! :policia: \\n\\nCom licença, @${post.user.userName}.\\n\\nReparei que este post (${post.url}) tem uma imagem ou vídeo sem descrição. Como na ${process.env.INSTANCE_NAME} temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.\\n\\nPor favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.\\n\\nMuito obrigado por sua compreensão e apoio!"

    const timelinMock: ITimeline = {
      minId: '1212',
      posts: [{
        content: "foo",
        creationData: '2023-02-17T19:47:15.598Z',
        id: "1",
        url: `https://${process.env.INSTANCE_URL}/users/teste/statuses/123445`,
        user: {
          id: "1",
          userName: "foo"
        },
        media: [{
          id: "1",
          description: "",
          type: "",
          url: `https://${process.env.INSTANCE_URL}/users/teste/statuses/123445`
        }]
      },{
        content: "foo",
        creationData: '2023-02-17T19:47:15.598Z',
        id: "1",
        url: "htt://localhost1",
        user: {
          id: "1",
          userName: "foo"
        },
        media: [{
          id: "1",
          description: "",
          type: "",
          url: ""
        }]
      },{
        content: "bar",
        creationData: '2023-02-17T19:47:15.598Z',
        id: "2",
        url: "htt://localhost2",
        user: {
          id: "1",
          userName: "foo"
        },
        media: [{
          id: "1",
          description: "Some description",
          type: "",
          url: ""
        }]
      },{
        content: "bar",
        creationData: '2023-02-17T19:47:15.598Z',
        id: "4",
        url: `https://${process.env.INSTANCE_URL}/teste`,
        user: {
          id: "1",
          userName: "foo"
        },
        media: [{
          id: "1",
          description: null,
          type: "",
          url: ""
        }]
      }]
    }

    const timeline = new Timeline(timelinMock);

    const actual = timeline.GetLocalPostswithoutDescription();

    expect(actual).toEqual([{
      content: "foo",
      creationData: '2023-02-17T19:47:15.598Z',
      id: "1",
      url: `https://${process.env.INSTANCE_URL}/users/teste/statuses/123445`,
      user: {
        id: "1",
        userName: "foo"
      },
      media: [{
        id: "1",
        description: "",
        type: "",
        url: `https://${process.env.INSTANCE_URL}/users/teste/statuses/123445`
      }]
    }, {
      content: "bar",
      creationData: '2023-02-17T19:47:15.598Z',
      id: "4",
      url: `https://${process.env.INSTANCE_URL}/teste`,
      user: {
        id: "1",
        userName: "foo"
      },
      media: [{
        id: "1",
        description: null,
        type: "",
        url: ""
      }]
    }])
  })
});