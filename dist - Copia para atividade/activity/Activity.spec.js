"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const Activity_1 = __importDefault(require("./Activity"));
describe('Activity', () => {
    beforeAll(() => {
        jest.clearAllMocks();
    });
    it('deve iniciar o registro de atividade e criar um novo arquivo, caso não exista nenhum', () => {
        const saveDataMock = jest.fn();
        const expected$ = new rxjs_1.Subject();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: saveDataMock,
            LoadedData$: (0, rxjs_1.throwError)(() => ({ code: 'ENOENT' })),
            SavedData$: expected$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('1231231231')
        }));
        const service = new Activity_1.default(factory, momentFactory);
        service.Init();
        expected$.subscribe({
            next: () => {
                expect(saveDataMock).lastCalledWith({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 0,
                        PostSendErrors: 0,
                        LastActivity: '1231231231'
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 0,
                        PostSendErrors: 0,
                        StartedAt: '1231231231'
                    }
                });
            }
        });
    });
    it('deve iniciar o registro de atividade e carregar o arquivo gerado, caso já exista um', () => {
        const expected = {
            today: {
                TimelineReadingErrors: 12,
                AcessibilityFailedPosts: 1,
                PostSendErrors: 1,
                LastActivity: '23423423'
            },
            allTime: {
                TimelineReadingErrors: 1121,
                AcessibilityFailedPosts: 112,
                PostSendErrors: 11,
                StartedAt: '23423423'
            }
        };
        const actual$ = (0, rxjs_1.of)(expected);
        const expected$ = new rxjs_1.Subject();
        const saveDataMock = jest.fn();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: saveDataMock,
            LoadedData$: actual$,
            SavedData$: expected$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('1231231231')
        }));
        const service = new Activity_1.default(factory, momentFactory);
        service.Init();
        expected$.subscribe({
            next: () => {
                expect(saveDataMock).lastCalledWith({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 0,
                        PostSendErrors: 0,
                        LastActivity: '1231231231'
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 0,
                        PostSendErrors: 0,
                        StartedAt: '1231231231'
                    }
                });
            }
        });
    });
    it('deve registrar um novo post de erro de acessibilidade, no mesmo dia.', () => {
        const initial = {
            today: {
                TimelineReadingErrors: 0,
                AcessibilityFailedPosts: 0,
                PostSendErrors: 0,
                LastActivity: '1111111'
            },
            allTime: {
                TimelineReadingErrors: 300,
                AcessibilityFailedPosts: 3,
                PostSendErrors: 0,
                StartedAt: '1111111'
            }
        };
        const initial$ = (0, rxjs_1.of)(initial);
        const actual$ = new rxjs_1.Subject();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: jest.fn(),
            LoadedData$: initial$,
            SavedData$: actual$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('234234'),
            diff: jest.fn().mockReturnValue(0)
        }));
        const service = new Activity_1.default(factory, momentFactory);
        actual$.subscribe({
            next: (expected) => {
                expect(expected).toEqual({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 1,
                        PostSendErrors: 0
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 4,
                        PostSendErrors: 0,
                        StartedAt: '1111111'
                    }
                });
            }
        });
        service.RegisterNewAcessibilityFailedPost();
    });
    it.only('deve registrar um novo post de erro de acessibilidade, num outro dia.', () => {
        const initial = {
            today: {
                TimelineReadingErrors: 12,
                AcessibilityFailedPosts: 1,
                PostSendErrors: 1,
                LastActivity: '1111111'
            },
            allTime: {
                TimelineReadingErrors: 300,
                AcessibilityFailedPosts: 3,
                PostSendErrors: 0,
                StartedAt: '1111111'
            }
        };
        const initial$ = (0, rxjs_1.of)(initial);
        const actual$ = new rxjs_1.Subject();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: jest.fn(),
            LoadedData$: initial$,
            SavedData$: actual$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('025151515'),
            diff: jest.fn().mockReturnValue(1)
        }));
        const service = new Activity_1.default(factory, momentFactory);
        actual$.subscribe({
            next: (expected) => {
                expect(expected).toEqual({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 1,
                        PostSendErrors: 0,
                        StartedAt: '0'
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 3,
                        PostSendErrors: 0,
                        StartedAt: '025151515'
                    }
                });
            }
        });
        initial$.subscribe({ next: () => {
                console.log('fazendo');
                service.RegisterNewAcessibilityFailedPost();
            } });
    });
    it('deve registrar um novo erro timeline, no mesmo dia.', () => {
        const initial = {
            today: {
                TimelineReadingErrors: 665,
                AcessibilityFailedPosts: 121,
                PostSendErrors: 1,
                LastActivity: '234234234'
            },
            allTime: {
                TimelineReadingErrors: 12312312,
                AcessibilityFailedPosts: 1122,
                PostSendErrors: 121,
                StartedAt: '0221'
            }
        };
        const initial$ = (0, rxjs_1.of)(initial);
        const actual$ = new rxjs_1.Subject();
        const factory = () => ({
            LoadData: jest.fn(),
            SaveData: jest.fn(),
            LoadedData$: initial$,
            SavedData$: actual$
        });
        const momentFactory = (() => ({
            format: jest.fn().mockReturnValue('1231231312'),
            diff: jest.fn().mockReturnValue(0)
        }));
        const service = new Activity_1.default(factory, momentFactory);
        service.Init();
        actual$.subscribe({
            next: (expected) => {
                expect(expected).toEqual({
                    today: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 1,
                        PostSendErrors: 0,
                        StartedAt: '025151515'
                    },
                    allTime: {
                        TimelineReadingErros: 0,
                        AcessibilityFailedPosts: 4,
                        PostSendErrors: 0,
                        StartedAt: '025151515'
                    }
                });
            }
        });
        service.RegisterNewTimelineReadError();
    });
});
