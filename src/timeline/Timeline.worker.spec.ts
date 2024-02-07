import { TestScheduler } from 'rxjs/testing';
import { IWorker } from "../worker/IWorker";
import { ITimeline } from "./ITimeline";
import { TimelineWorker } from "./TImeline.worker";
import { IPersistence } from "../persistence/IPersistence";
import { IPost } from '../posts/Post';
import { ITimelineService } from './Timeline.Mastodon.service';

describe('Timeline worker', () => {
  jest.useFakeTimers();
  jest.setTimeout(3 * 1000);

  let testScheduler: TestScheduler;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  })

  it('Deve iniciar timeline do zero, criando um arquivo novo', async () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const saveDataMock = jest.fn();

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<ITimeline>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: cold('---a|', {
          a: {
            content: {
              minId: 121212,
              posts: [{
                content: 'test',
                creationData: '2024-01-01',
                id: '9iu8498234',
                url: 'http:\\\\',
                user: 'silasX',
                media: [{
                  id: "45645456",
                  type: "image",
                  description: "capibara in a river",
                  url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
                }]
              }]
            }
          }
        }),
        SaveData: saveDataMock,
      })

      const worker = new TimelineWorker(persistenceFactory());

      expectObservable(worker.Load()).toBe('-----a', {
        a: {
          description: worker.TIMELINE_ENTRY_DESCRIPTION,
          value: {
            minId: 121212,
            posts: [{
              content: 'test',
              creationData: '2024-01-01',
              id: '9iu8498234',
              url: 'http:\\\\',
              user: 'silasX',
              media: [{
                id: "45645456",
                type: "image",
                description: "capibara in a river",
                url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
              }]
            }]
          }
        }
      });
      testScheduler.flush();

      expect(saveDataMock).lastCalledWith({
        timeLine: {
          minId: '0',
          posts: [{
            content: '',
            creationData: '',
            id: '',
            url: '',
            user: {
              id: '0',
              userName: 'foo'
            },
            media: []
          }]
        }
      })
    });
  });

  it('deve informar erro no carregamento de timeline existente', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const persistenceFactory = () => ({
        LoadedData$: cold('--b|', {
          b: {
            persistenceError: {
              isErrorNoFile: false,
              errorData: 'Erro ao abrir arquivo'
            }
          } as unknown as IPersistence<ITimeline>}),
        LoadData: jest.fn(),
      });

      const worker = new TimelineWorker(persistenceFactory());

      expectObservable(worker.Load()).toBe('--b', {
        b: {
          description: worker.TIMELINE_ENTRY_DESCRIPTION,
          error: {
            message: 'Erro ao carregar arquivo timeline',
            data: 'Erro ao abrir arquivo'
          },
        }
      });
    });
    testScheduler.flush();
  });

  it('deve informar erro ao tentar gerar nova timeline', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const persistenceFactory = () => ({
        LoadedData$: cold('--b|', {
          b: {
            persistenceError: {
              isErrorNoFile: true,
            }
          } as unknown as IPersistence<ITimeline>}),
        LoadData: jest.fn(),
        SaveData: jest.fn(),
        SavedData$: cold('---c|', {
          c: {
            persistenceError: {
              isErrorNoFile: false,
              errorData: 'Error save file'
            }
          }
        })
      });

      const worker = new TimelineWorker(persistenceFactory());

      expectObservable(worker.Load()).toBe('-----c', {
        c: {
          description: worker.TIMELINE_ENTRY_DESCRIPTION,
          error: {
            message: 'Erro ao iniciar arquivo timeline',
            data: 'Error save file'
          },
        }
      });
    });
    testScheduler.flush();
  });

  it('Deve reiniciar timeline, carregando um arquivo já previamente carregado.', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            content: {
              minId: '121212',
              posts: [{
                content: 'test',
                creationData: '2024-01-01',
                id: '9iu8498234',
                url: 'ss:\\\\',
                user: {
                  id: '12312312',
                  userName: 'foo'
                },
                media: [{
                  id: "45645456",
                  type: "image",
                  description: "capibara in a river",
                  url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
                }]
              }]
            }
          } as unknown as IPersistence<ITimeline>}),
        LoadData: jest.fn(),
      });

      const worker = new TimelineWorker(persistenceFactory());

      expectObservable(worker.Load()).toBe('--a', {
        a: {
          description: worker.TIMELINE_ENTRY_DESCRIPTION,
          value: {
            minId: '121212',
            posts: [{
              content: 'test',
              creationData: '2024-01-01',
              id: '9iu8498234',
              url: 'ss:\\\\',
              user: {
                id: '12312312',
                userName: 'foo'
              },
              media: [{
                id: "45645456",
                type: "image",
                description: "capibara in a river",
                url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
              }]
            }]
          }
        }    
      });
    });
    testScheduler.flush();
  });

  it('deve emitir uma lista de posts com erro de acessibilidade, depois que receber dados da timeline', () => {
    process.env.NODE_ENV = 'dev';
    process.env.INSTANCE_URL='ursal.zone';

    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
    

      const persistenceFactory = jest.fn();
      const serviceFactory = () => ({
        LoadTimeline: jest.fn(),
        timeline$: cold('----t', {
          t: {
            error: null,
            timeline: {
              minId: '57756756',
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
          }
        })
      })
      const worker = new TimelineWorker(persistenceFactory, serviceFactory());
      worker.Init();

      jest.runOnlyPendingTimers();

      expectObservable(worker.WorkerEvent$).toBe('----p', { p: {
        description: worker.POST_EMIT_DESCRIPTION,
        value: [{
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
        }]
      } as IWorker<IPost[]>})
    });
    testScheduler.flush();
  })

  it('deve emitir um erro de leitura de timeline, sempre que esta leitura der erro', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
    

      const persistenceFactory = jest.fn();
      const serviceFactory = () => ({
        LoadTimeline: jest.fn(),
        timeline$: cold('----t', {
          t: {
            error: {
              message: 'erro na requisição timeline',
              objectError: 'erro 404'
            }
          }
        })
      })
      const worker = new TimelineWorker(persistenceFactory, serviceFactory());
      worker.Init();

      jest.runOnlyPendingTimers();

      expectObservable(worker.WorkerEvent$).toBe('----p', { p: {
        description: worker.TIMELINE_READ_ERROR,
        error: {
          message: 'erro na requisição timeline',
          data: 'erro 404'
        }
      } as IWorker<IPost[]>})
    });
    testScheduler.flush();
  })

  it('deve emitir um erro de leitura de timeline, sempre que a timeline não retornar nenhum valor', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
    

      const persistenceFactory = jest.fn();
      const serviceFactory = () => ({
        LoadTimeline: jest.fn(),
        timeline$: cold('----t', {
          t: {
            error: {
              message: 'timeline vazia',
              objectError: null
            }
          } as ITimelineService
        })
      })
      const worker = new TimelineWorker(persistenceFactory, serviceFactory());
      worker.Init();

      jest.runOnlyPendingTimers();

      expectObservable(worker.WorkerEvent$).toBe('----p', { p: {
        description: worker.TIMELINE_READ_ERROR,
        error: {
          message: 'timeline vazia',
          data: null
        }
      } as IWorker<IPost[]>})
    });
    testScheduler.flush();
  })

  it('deve criar uma Runner só para timeline', () => {
    const SECONDS = 10;
    const worker = new TimelineWorker(SECONDS);

    const runner = worker.CreateTimelineRunner();

    let actual = false;

    runner.Init(() => {
      actual = true;
    });
    jest.runOnlyPendingTimers();

    expect(actual).toBeTruthy();
  });
});