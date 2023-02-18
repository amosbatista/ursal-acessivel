import { Timeline, ITimeline } from './Timeline';

describe("timeline test", () => {
  it("must send a list of posts without description", () => {
    const timelinMock: ITimeline = {
      minId: '1212',
      posts: [{
        content: "foo",
        creationData: '2023-02-17T19:47:15.598Z',
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
        url: "https://ursal.zone/teste",
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
    }, {
      content: "bar",
      id: "4",
      url: "https://ursal.zone/teste",
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