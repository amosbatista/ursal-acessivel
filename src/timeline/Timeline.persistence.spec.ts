import { ITimeline } from "./Timeline";
import { TimelinePersistence } from "./Timeline.persistence"

describe('Timeline Persistence test', () => {
  let appendFileMock = jest.fn();
  let openFileMock = jest.fn().mockImplementation(() => {
    return '{"posts":[],"minId":"2123123123"}';
  });

  beforeAll(() => {
    appendFileMock.mockClear();
  });

  it('must load a timeline', () => {
    const appendFileMock = jest.fn();

    const persistence = new TimelinePersistence(appendFileMock, openFileMock, './test.txt');

    const timelineExpected: ITimeline = {
      posts: [],
      minId: '2123123123'
    }

    persistence.LoadedData$.subscribe({
      next: ((actualTimeline:ITimeline) => {
        expect(actualTimeline).toEqual(timelineExpected);
      }),
    });

    persistence.LoadData();
  })

  it('must persist the timeline to the file', () => {
    const appendFileMock = jest.fn();

    const persistence = new TimelinePersistence(appendFileMock, openFileMock, './test.txt');

    const timelineToSave: ITimeline = {
      posts: [],
      minId: '34354655'
    }

    persistence.SavedData$.subscribe({
      next: ((result: boolean) => {
        expect(result).toBeTruthy();
      }),
    });

    persistence.SaveData(timelineToSave);
  })
})