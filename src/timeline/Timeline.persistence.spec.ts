import { IPersistence } from "../persistence/IPersistence";
import { ITimeline } from "./Timeline.helpers";
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
      next: ((actualTimeline:IPersistence<ITimeline>) => {
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
      next: ((result: IPersistence<ITimeline>) => {
        expect(result).toEqual({
          content: {
            posts: [],
            minId: '34354655'
          }
        } as IPersistence<ITimeline>);
      }),
    });

    persistence.SaveData(timelineToSave);
  })
})