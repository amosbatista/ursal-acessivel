"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Timeline_persistence_1 = require("./Timeline.persistence");
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
        const persistence = new Timeline_persistence_1.TimelinePersistence(appendFileMock, openFileMock, './test.txt');
        const timelineExpected = {
            posts: [],
            minId: '2123123123'
        };
        persistence.LoadedData$.subscribe({
            next: ((actualTimeline) => {
                expect(actualTimeline).toEqual(timelineExpected);
            }),
        });
        persistence.LoadData();
    });
    it('must persist the timeline to the file', () => {
        const appendFileMock = jest.fn();
        const persistence = new Timeline_persistence_1.TimelinePersistence(appendFileMock, openFileMock, './test.txt');
        const timelineToSave = {
            posts: [],
            minId: '34354655'
        };
        persistence.SavedData$.subscribe({
            next: ((result) => {
                expect(result).toBeTruthy();
            }),
        });
        persistence.SaveData(timelineToSave);
    });
});
