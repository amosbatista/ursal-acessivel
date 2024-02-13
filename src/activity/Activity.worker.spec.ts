import { TestScheduler } from "rxjs/testing";
import { IActivity } from "./IActivity";
import { IWorker } from "../worker/IWorker";
import { IPersistence } from "../persistence/IPersistence";
import { ActivityWorker } from "./Activity.worker";
import { ActivityService } from "./Activity.service";
import activity_initial from "./mock/activity_initial";
import { IStatusResult } from "../status/Status.service";
import { IStatus } from "../status/Status";

describe('activity worker', () => {
  jest.useFakeTimers();
  jest.setTimeout(3 * 1000);

  let testScheduler: TestScheduler;

  process.env.NODE_ENV = 'dev';
  process.env.MASTODON_KEY = 'foo';
  process.env.INSTANCE_URL = 'ursal.zone';
  process.env.INSTANCE_NAME = "ursal";
  process.env.DM_MSG = "Alto lá! :policia: \\n\\nCom licença, @${post.user.userName}.\\n\\nReparei que este post (${post.url}) tem uma imagem ou vídeo sem descrição. Como na ${process.env.INSTANCE_NAME} temos muito apreço por abrir as portas e incluir pessoas com deficiência visual, gostaria de reforçar com você este acordo de acessibilidade.\\n\\nPor favor, veja se é possível revisar e editar seu toot (via app ou web), adicionando descrição nas mídias.\\n\\nMuito obrigado por sua compreensão e apoio!";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });


  it('Deve iniciar postagem acessiblidade do zero, criando um arquivo novo', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      
      const saveDataMock = jest.fn();

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<IActivity>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: cold('---a|', {
          a: {
            content: {
              today: {
                TimelineReadingErrors: 0,
                AcessibilityFailedPosts: 0,
                PostSendErrors: 0,
                LastActivity: '2024-01-01'
              },
              allTime: {
                TimelineReadingErrors: 0,
                AcessibilityFailedPosts: 0,
                PostSendErrors: 0,
                StartedAt: '2024-01-01'
              }
            }
          } as IPersistence<IActivity>
        }),
        SaveData: saveDataMock,
      }as unknown as any);

      const momentMock = (() => ({
        format: jest.fn().mockReturnValue('2024-01-01')
      }));

      const worker = new ActivityWorker(persistenceFactory(), new ActivityService(momentMock));

      expectObservable(worker.Load()).toBe('-----a', {
        a: {
          description: worker.ACTIVITY_LOADED,
          value: {
            today: {
              TimelineReadingErrors: 0,
              AcessibilityFailedPosts: 0,
              PostSendErrors: 0,
              LastActivity: '2024-01-01'
            },
            allTime: {
              TimelineReadingErrors: 0,
              AcessibilityFailedPosts: 0,
              PostSendErrors: 0,
              StartedAt: '2024-01-01'
            }
          }
        }
      } );
      testScheduler.flush();

      expect(saveDataMock).lastCalledWith( {
        today: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 0,
          LastActivity: '2024-01-01'
        },
        allTime: {
          TimelineReadingErrors: 0,
          AcessibilityFailedPosts: 0,
          PostSendErrors: 0,
          StartedAt: '2024-01-01'
        }
      });
    });
  });

  it('deve informar erro no carregamento de atividade existente', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const persistenceFactory = () => ({
        LoadedData$: cold('--b|', {
          b: {
            persistenceError: {
              isErrorNoFile: false,
              errorData: 'Erro ao abrir arquivo'
            }
          } as unknown as IPersistence<IActivity>}),
        LoadData: jest.fn(),
      } as unknown as any);

      const momentMock = (() => ({
        format: jest.fn().mockReturnValue('2024-01-01')
      }));

      const worker = new ActivityWorker(persistenceFactory(), new ActivityService(momentMock));

      expectObservable(worker.Load()).toBe('--b', {
        b: {
          description: worker.ACTIVITY_LOADED,
          error: {
            message: 'Erro ao carregar arquivo atividade',
            data: 'Erro ao abrir arquivo'
          },
        }
      });
    });
    testScheduler.flush();
  });

  it('deve informar erro ao tentar gerar nova atividade', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const persistenceFactory = () => ({
        LoadedData$: cold('--b|', {
          b: {
            persistenceError: {
              isErrorNoFile: true,
            }
          } as unknown as IPersistence<IActivity>}),
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
      } as unknown as any);

      const momentMock = (() => ({
        format: jest.fn().mockReturnValue('2024-01-01')
      }));

      const worker = new ActivityWorker(persistenceFactory(), new ActivityService(momentMock));

      expectObservable(worker.Load()).toBe('-----c', {
        c: {
          description: worker.ACTIVITY_LOADED,
          error: {
            message: 'Erro ao carregar arquivo atividade',
            data: 'Error save file'
          },
        }
      });
    });
    testScheduler.flush();
  });

  it('Deve reiniciar atividade, carregando um arquivo já previamente carregado.', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const postMock: IPersistence<IActivity> = {
        content: {
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
        }
      };

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: postMock
        }),
        LoadData: jest.fn(),
      } as unknown as any);

      const momentMock = (() => ({
        format: jest.fn().mockReturnValue('2024-01-01')
      }));

      const worker = new ActivityWorker(persistenceFactory(), new ActivityService(momentMock));

      expectObservable(worker.Load()).toBe('--a', {
        a: {
          description: worker.ACTIVITY_LOADED,
          value: postMock.content
        } as IWorker<IActivity>
      });
    });
    testScheduler.flush();
  });

  it('deve receber uma ação de nova postagem de alerta de acessibilidade e gravar numa atividade nova', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      
      const saveDataMock = jest.fn();
      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<IActivity>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: cold('---a', {
          a: activity_initial
        }),
        SaveData: saveDataMock
      } as unknown as any);

      const same_day = 0
      const momentMock = (() => ({
        format: jest.fn().mockReturnValue('2024-01-01'),
        diff: () => (same_day)
      }));

      const worker = new ActivityWorker(persistenceFactory(), new ActivityService(momentMock));

      worker.Load().subscribe(() => {
        worker.Action({
          description: worker.ACTION_NEW_ACESSIBILITY_POST,
        });

        const expected =  {
          today: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 1,
            PostSendErrors: 0,
            LastActivity: '2024-01-01'
          },
          allTime: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 1,
            PostSendErrors: 0,
            StartedAt: '2024-01-01'
          }
        }
        expect(worker.GetActivity()).toEqual(expected);
        expect(saveDataMock).toHaveBeenCalledWith(expected);
      });
    });
    testScheduler.flush();
  });

  it('deve receber uma ação de nvo erro de leitura de timeline e gravar numa atividade nova', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      
      const saveDataMock = jest.fn();
      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<IActivity>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: cold('---a', {
          a: activity_initial
        }),
        SaveData: saveDataMock
      } as unknown as any);

      const same_day = 0
      const momentMock = (() => ({
        format: jest.fn().mockReturnValue('2024-01-01'),
        diff: () => (same_day)
      }));

      const worker = new ActivityWorker(persistenceFactory(), new ActivityService(momentMock));

      worker.Load().subscribe(() => {
        worker.Action({
          description: worker.ACTION_TIMELINE_READ_ERROR,
        });

        const expected =  {
          today: {
            TimelineReadingErrors: 1,
            AcessibilityFailedPosts: 0,
            PostSendErrors: 0,
            LastActivity: '2024-01-01'
          },
          allTime: {
            TimelineReadingErrors: 1,
            AcessibilityFailedPosts: 0,
            PostSendErrors: 0,
            StartedAt: '2024-01-01'
          }
        }
        expect(worker.GetActivity()).toEqual(expected);
        expect(saveDataMock).toHaveBeenCalledWith(expected);
      });
    });
    testScheduler.flush();
  });

  it('deve receber uma ação de nvo erro de envio de posts e gravar numa atividade nova', () => {
    testScheduler.run((helpers) => {
      const { cold } = helpers;
      
      const saveDataMock = jest.fn();
      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<IActivity>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: cold('---a', {
          a: activity_initial
        }),
        SaveData: saveDataMock
      } as unknown as any);

      const same_day = 0
      const momentMock = (() => ({
        format: jest.fn().mockReturnValue('2024-01-01'),
        diff: () => (same_day)
      }));

      const worker = new ActivityWorker(persistenceFactory(), new ActivityService(momentMock));

      worker.Load().subscribe(() => {
        worker.Action({
          description: worker.ACTION_SEND_POST_ERROR,
        });

        const expected =  {
          today: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 0,
            PostSendErrors: 1,
            LastActivity: '2024-01-01'
          },
          allTime: {
            TimelineReadingErrors: 0,
            AcessibilityFailedPosts: 0,
            PostSendErrors: 1,
            StartedAt: '2024-01-01'
          }
        }
        expect(worker.GetActivity()).toEqual(expected);
        expect(saveDataMock).toHaveBeenCalledWith(expected);
      });
    });
    testScheduler.flush();
  });

  it('deve registrar algo, e postar um toot da útima atividade em novo ciclo', () => {
    testScheduler.run((helpers) => {
      const { cold } = helpers;
      
      const saveDataMock = jest.fn();
      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<IActivity>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: cold('---a', {
          a: activity_initial
        }),
        SaveData: saveDataMock
      } as unknown as any);

      const different_day = 1
      const momentMock = (() => ({
        format: jest.fn().mockReturnValue('2024-01-01'),
        diff: () => (different_day)
      }));

      const StatusPostMock = jest.fn();
      const StatusFactory = () => ({
        Post: StatusPostMock
      } as unknown as any);

      const one_minute = 60;
      const worker = new ActivityWorker(persistenceFactory(), new ActivityService(momentMock), one_minute, StatusFactory());

      worker.Load().subscribe(() => {

        worker.SetExecutable();
        worker.Init();

        worker.Action({
          description: worker.ACTION_NEW_ACESSIBILITY_POST,
        });

        worker.Action({
          description: worker.ACTION_NEW_ACESSIBILITY_POST,
        });

        worker.Action({
          description: worker.ACTION_SEND_POST_ERROR,
        });

        worker.Action({
          description: worker.ACTION_TIMELINE_READ_ERROR,
        });

        jest.runOnlyPendingTimers();

        expect(StatusPostMock).toHaveBeenCalledWith({
          status: `
      Registro de atividade do robô acessível:

      Última atividade: 2024-01-01, 
      Toots sem descrição alertados hoje: 0, 
      Erros de leitura de timeline, hoje: 1, 
      Falha de envio de toots, hoje: 0, 

      Registros desde o início da operação, em 2024-01-01:
      Toots sem descrição alertados: 2, 
      Erros de leitura de timeline: 1, 
      Falha de envio de toots: 1.
    `,
          visibility: 'public'
        } as IStatus);

      });
    });
    testScheduler.flush();
  });

});