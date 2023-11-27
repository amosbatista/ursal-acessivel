import {shouldPostSendToReturnList} from './index'
import { IPost } from './posts/Post';
import { IUser } from './users/User';

describe("um teste básico", () => {
  it("dois mais dois ser igual a quatro", () => {
    expect(2+2).toBe(4);
  })


  it('check if a post has problem with acessibility, the list is empty, and return true', () => {
    const usersAlreadyWarned: IUser[] = [];  
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

    expect(shouldPostSendToReturnList(post, usersAlreadyWarned)).toBeTruthy();
  });


  it('check if a post has problem with acessibility, the list is already with user, and return false', () => {
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

    const usersAlreadyWarned: IUser[] = [{
      id: "1",
      userName: "foo"
    }];  

    expect(shouldPostSendToReturnList(post, usersAlreadyWarned)).toBeFalsy();
  });


  

});