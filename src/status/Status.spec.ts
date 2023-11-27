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
      status: `${process.env.DM_MSG}`
    }

    expect(CreateStatusForNonAcessiblePost(post)).toEqual(expected);
  });
});