import {shouldPostSendToReturnList} from './index'
import { IUser } from './User';

describe("um teste básico", () => {
  it("dois mais dois ser igual a quatro", () => {
    expect(2+2).toBe(4);
  })


  it('check if a post has problem with acessibility, the list is empty, and return true', () => {
    const usersAlreadyWarned: IUser[] = [];  
    const post = {
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

    expect(shouldPostSendToReturnList(post, usersAlreadyWarned)).toBeTruthy();
  });


  it('check if a post has problem with acessibility, the list is already with user, and return false', () => {
    const post = {
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

    const usersAlreadyWarned: IUser[] = [{
      id: "1",
      userName: "foo"
    }];  

    expect(shouldPostSendToReturnList(post, usersAlreadyWarned)).toBeFalsy();
  });


  

});