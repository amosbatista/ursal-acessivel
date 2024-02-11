import { TestScheduler } from 'rxjs/testing';
import { IPost } from '../posts/Post';
import { IPersistence } from '../persistence/IPersistence';
import { AcessibilityStatusWorker } from './AcessibilityStatus.worker';
import { IWorker } from '../worker/IWorker';
import post_list_full from './mocks/post_list_full';
import post_list_more_than_one from './mocks/post_list_more_than_one';
import post_list_new_ones from './mocks/post_list_new_ones';
import post_list_new_onesOnly_acessbility_problems from './mocks/post_list_new_ones_without_duplkicates';
import post_list_new_ones_without_top from './mocks/post_list_take_top_news_without_top';
import post_list_new_ones_only_top from './mocks/post_list_take_top_news_only_top';
import post_list_take_top_news from './mocks/post_list_take_top_news';
import post_persist from './mocks/post_persist';
import post_to_send from './mocks/post_to_send';
import { CreateStatusForNonAcessiblePost, IStatus } from './Status';
import { Observable, Subscriber, of, throwError } from 'rxjs';
import { IStatusResult } from './Status.service';
import post_list_full_test1 from './mocks/post_list_full_test1';
import post_full_test1_to_send from './mocks/post_full_test1_to_send';
import post_list_full_test2 from './mocks/post_list_full_test2';

describe('AcessibilityStatus worker', () => {
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
  })

  it('Deve iniciar postagem acessiblidade do zero, criando um arquivo novo', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const saveDataMock = jest.fn();

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<IPost[]>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: cold('---a|', {
          a: {
            content: []
          } as IPersistence<IPost[]>
        }),
        SaveData: saveDataMock,
      });

      const worker = new AcessibilityStatusWorker(persistenceFactory());

      expectObservable(worker.Load()).toBe('-----a', {
        a: {
          description: worker.ACESSIBILITY_POST_DESCRIPTION,
          value: []          
        } as IWorker<IPost[]>
      } );
      testScheduler.flush();

      expect(saveDataMock).lastCalledWith([]);
    });
  });

  it('deve informar erro no carregamento de postagens enviadas existente', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const persistenceFactory = () => ({
        LoadedData$: cold('--b|', {
          b: {
            persistenceError: {
              isErrorNoFile: false,
              errorData: 'Erro ao abrir arquivo'
            }
          } as unknown as IPersistence<IPost[]>}),
        LoadData: jest.fn(),
      });

      const worker = new AcessibilityStatusWorker(persistenceFactory());

      expectObservable(worker.Load()).toBe('--b', {
        b: {
          description: worker.ACESSIBILITY_POST_DESCRIPTION,
          error: {
            message: 'Erro ao carregar arquivo posts enviados',
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
          } as unknown as IPersistence<IPost[]>}),
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

      const worker = new AcessibilityStatusWorker(persistenceFactory());

      expectObservable(worker.Load()).toBe('-----c', {
        c: {
          description: worker.ACESSIBILITY_POST_DESCRIPTION,
          error: {
            message: 'Erro ao iniciar arquivo posts enviados',
            data: 'Error save file'
          },
        }
      });
    });
    testScheduler.flush();
  });

  it('Deve reiniciar lista de postagens enviadas, carregando um arquivo já previamente carregado.', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const postMock: IPersistence<IPost[]> = {
        content: post_list_full
      };

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: postMock
        }),
        LoadData: jest.fn(),
      });

      const worker = new AcessibilityStatusWorker(persistenceFactory());

      expectObservable(worker.Load()).toBe('--a', {
        a: {
          description: worker.ACESSIBILITY_POST_DESCRIPTION,
          value: postMock.content
        } as IWorker<IPost[]>
      });
    });
    testScheduler.flush();
  });

  it('deve verificar se um post já foi disparado anteriormente', () => {
    testScheduler.run((helpers) => {
      const { cold } = helpers;

      const postMock: IPersistence<IPost[]> = {
        content: post_list_full
      };

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: postMock
        }),
        LoadData: jest.fn(),
      });

      const worker = new AcessibilityStatusWorker(persistenceFactory());
      const observable = worker.Load();
      observable.subscribe(() => {
        
        const samePost: IPost = {
          id: "234234238238823823",
          creationData: '2024-02-06T17:00:01.000Z',
          url: "https://bots.rumiancev.com/@5345345/123423469682119",
          content: "foo bar no pics sent",
          media: [{
            id: "134435345",
            type: "image",
            description: null,
            url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
          }],
          user: {
            id: "456645645645",
            userName: "john_dee2323",
          }
        };

        expect(worker.IsPostNeverSent(samePost)).toBeFalsy();

        const otherPost: IPost = {
          id: "9954545689465465464",
          creationData: '2021-02-06T17:00:01.000Z',
          url: "https://ursal.zone/@5345345/123423469682119",
          content: "novo post",
          media: [{
            id: "345345",
            type: "image",
            description: null,
            url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
          }],
          user: {
            id: "77657567",
            userName: "fulano",
          }
        };
        expect(worker.IsPostNeverSent(otherPost)).toBeTruthy();

      });
      testScheduler.flush();
    });
  });

  it('deve receber uma lista de posts e, caso eles sejam novos, adicioná-los no fim da fila de postagem', () => {
    testScheduler.run((helpers) => {
      const { cold } = helpers;

      const postMock: IPersistence<IPost[]> = {
        content: post_list_more_than_one
      };

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: postMock
        }),
        LoadData: jest.fn(),
      });

      const worker = new AcessibilityStatusWorker(persistenceFactory());

      worker.Load().subscribe(() => {
        const newPostList = post_list_new_ones;
        worker.Action({
          description: worker.ACTION_STACK_NEW_POSTS,
          value: newPostList
        });

        expect(worker.GetPostToSendStack()).toEqual(post_list_new_onesOnly_acessbility_problems);
      });
      
      testScheduler.flush();

    });
  });

  it('deve remover um post do topo da fila de posts e retorná-lo', () => {
    testScheduler.run((helpers) => {
      const { cold } = helpers;

      const postMock: IPersistence<IPost[]> = {
        content: post_list_more_than_one
      };

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<IPost[]>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: cold('---a|', {
          a: {
            content: []
          } as IPersistence<IPost[]>
        }),
        SaveData: jest.fn(),
      });

      const worker = new AcessibilityStatusWorker(persistenceFactory());

      worker.Load().subscribe(() => {
        const newPostList = post_list_take_top_news;
        worker.Action({
          description: worker.ACTION_STACK_NEW_POSTS,
          value: newPostList
        });

        expect(worker.GetTheTopPostToSend()).toEqual(post_list_new_ones_only_top);
        expect(worker.GetPostToSendStack()).toEqual(post_list_new_ones_without_top);
      });
      
      testScheduler.flush();

    });
  });

  it('deve persistir a lista de postagem', () => {
    testScheduler.run((helpers) => {

      const { cold } = helpers;
      const savePostMock = jest.fn();
      const saveDataMock$ = cold('---a---n', {
        a: {
          content: []
        } as IPersistence<IPost[]>,
        n: {
          content: [post_persist]
        } as IPersistence<IPost[]>,
      })

      const persistenceFactory = () => ({
        LoadedData$: cold('a|', {
          a: {
            persistenceError: {
              isErrorNoFile: true
            } as IPersistence<IPost[]>
          }
        }),
        LoadData: jest.fn(),
        SavedData$: saveDataMock$,
        SaveData: savePostMock,
      });

      const worker = new AcessibilityStatusWorker(persistenceFactory());

      worker.Load().subscribe(() => {
        worker.PersistSentPostList();
  
        
        expect(savePostMock).toBeCalledWith([]);

      })

      testScheduler.flush();
    });    
  });

  it('Após emitir post de falha de acessibilidade, deve emitir um evento avisando erro caso não consiga emitir post.', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
    
      const persistenceFactory = () => ({
        LoadedData$: of(),
        LoadData: jest.fn(),
        SavedData$: of(),
        SaveData: jest.fn(),
      });

      const Sent$Mock = cold('---e', {
        e: {
          error: {
            message: 'Erro em serviço request',
            objectError: 'HTTP 404'
          }
        } as IStatusResult
      })
      const PostMock = () => (Sent$Mock);
      
      const serviceFactory = () => ({
        Post: PostMock,
      });
      const worker = new AcessibilityStatusWorker(persistenceFactory(), serviceFactory());

      expectObservable(worker.WorkerEvent$).toBe('---e', {
        e: {
          description: worker.EVENT_POST_SENT_ERROR,
          error: {
            message: 'Erro ao escrever post de alerta acessibilidade',
            data: 'Erro em serviço request - HTTP 404'
          }
        } as IWorker<IPost>
      });

      worker.SendPost(post_to_send);

      testScheduler.flush();
      
    });
  
  });

  it('Após emitir post de falha de acessibilidade, deve emitir um evento avisando erro (como objeto) caso não consiga emitir post.', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
    
      const persistenceFactory = () => ({
        LoadedData$: of(),
        LoadData: jest.fn(),
        SavedData$: of(),
        SaveData: jest.fn(),
      });

      const Sent$Mock = cold('---e', {
        e: {
          error: {
            message: 'Erro em serviço request',
            objectError: { e: 'Error 500 HTTP'}
          }
        } as IStatusResult
      })
      const PostMock = () => (Sent$Mock);
      
      const serviceFactory = () => ({
        Post: PostMock,
      });
      const worker = new AcessibilityStatusWorker(persistenceFactory(), serviceFactory());

      expectObservable(worker.WorkerEvent$).toBe('---e', {
        e: {
          description: worker.EVENT_POST_SENT_ERROR,
          error: {
            message: 'Erro ao escrever post de alerta acessibilidade',
            data: 'Erro em serviço request - {\"e\":\"Error 500 HTTP\"}'
          }
        } as IWorker<IPost>
      });

      worker.SendPost(post_to_send);

      testScheduler.flush();
      
    });
  
  });


  it('Após emitir post de falha de acessibilidade, deve emitir um evento avisando que o post foi enviado com sucesso.', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      
      const savePostMock = jest.fn();

      const persistenceFactory = () => ({
        LoadedData$: of(),
        LoadData: jest.fn(),
        SavedData$: of(),
        SaveData: savePostMock,
      });

      const Sent$Mock = cold('---o|', {
        o: {
          content: post_to_send
        } as IStatusResult
      });
      const PostMock = () => (Sent$Mock);
      
      const serviceFactory = () => ({
        Post: PostMock,
      });
      const worker = new AcessibilityStatusWorker(persistenceFactory(), serviceFactory());

      expectObservable(worker.WorkerEvent$).toBe('---e', {
        e: {
          description: worker.EVENT_ACESSIBILIT_POST_SENT,
          value: post_to_send
        } as IWorker<IPost>
      })
      worker.SendPost(post_to_send);

      testScheduler.flush();

      expect(savePostMock).toBeCalledWith(post_to_send)
    });
  
  });

  it.only('deve adicionar posts para envio à partir de action', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      
      const savePostMock = jest.fn();

      const persistenceFactory = () => ({
        LoadedData$: cold('--a', {
          a: {
            content: post_list_full
         } as IPersistence<IPost[]>
        }),
        LoadData: jest.fn(),
        SavedData$: of(),
        SaveData: savePostMock,
      });

      const Sent$Mock = cold('---o|', {
        o: {
          content: post_to_send
        } as IStatusResult
      });
      const PostMock = () => (Sent$Mock);
      
      const serviceFactory = () => ({
        Post: PostMock,
      });
      const worker = new AcessibilityStatusWorker(persistenceFactory(), serviceFactory());

      worker.Load().subscribe( () => {

      
        worker.SetExecutable();
        worker.Init();

        const newPostMayBeSent = {
          id: "45645656756",
          creationData: '2021-02-06T17:27:01.000Z',
          url: "https://teste.com/@jon_dee/45645656756",
          content: "some post without description",
          media: [{
            id: "109818965692612911",
            type: "image",
            description: null,
            url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
          }, {
            id: "45645456",
            type: "image",
            description: "capibara in a river",
            url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
          }],
          user: {
            id: "66698195118",
            userName: "jon_dee",
          }
        }

        expectObservable(worker.WorkerEvent$).toBe('-----e', {
          e: {
            description: worker.EVENT_ACESSIBILIT_POST_SENT,
            value: newPostMayBeSent,
          } as IWorker<IPost>
        })

        worker.Action({
          description: worker.ACTION_STACK_NEW_POSTS,
          value: post_list_new_ones
        });

        jest.runOnlyPendingTimers();
        testScheduler.flush();

        const sentPostsPlusFirstTest = post_list_full.concat(newPostMayBeSent);
        expect(savePostMock).toHaveBeenLastCalledWith(sentPostsPlusFirstTest);

        // Teste 2
        const newPostMayBeSent2 = {
          id: "55555555555456464",
          creationData: '2024-03-06T17:00:01.000Z',
          url: "https://bots.rumiancev.com/@5345345/55555555555456464",
          content: "some post with all description",
          media: [{
            id: "134435345",
            type: "image",
            description: "river on sunset",
            url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/56756756756.jpg"
          }],
          user: {
            id: "234234234",
            userName: "5345345",
          }
        };
        expectObservable(worker.WorkerEvent$).toBe('---------e', {
          e: {
            description: worker.EVENT_ACESSIBILIT_POST_SENT,
            value: newPostMayBeSent2
          } as IWorker<IPost>
        });
        
        jest.runOnlyPendingTimers();
        testScheduler.flush();

        const sentPostsPlusSecondTest = sentPostsPlusFirstTest.concat(newPostMayBeSent2);
        expect(savePostMock).toHaveBeenLastCalledWith(sentPostsPlusSecondTest);
      });

    });
  })

  it.skip('deve iniciar o worker, receber ações e ir processando a lista em decorrer do tempo', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable, hot } = helpers;
      
      // Inciializando worker
      const loaded: IPersistence<IPost[]> = {
        content: post_list_full
      };

      const SaveDataMock = jest.fn();
      const Saved$Mock = hot('^---s---h', {
        s: {
          content: post_list_full
        } as IPersistence<IPost[]>
      })

      const persistenceFactory = () => ({
        LoadedData$: cold('--a|', {
          a: loaded
        }),
        LoadData: jest.fn(),
        SaveData: SaveDataMock,
        SavedData$: Saved$Mock
      });

      
      // Serviço de Mastodom
      const Sent$Mock = hot('^---o---p', {
        o: {
          content: post_to_send
        } as IStatusResult,
        p: {
          content: post_to_send
        } as IStatusResult
      });
      const PostMock = () => (Sent$Mock);
      const serviceFactory = () => ({
        Post: PostMock,
      });

      // Instanciando
      const worker = new AcessibilityStatusWorker(persistenceFactory(), serviceFactory());

      expectObservable(worker.Load()).toBe('--a', {
        a: loaded
      });

      testScheduler.flush();

      // Recebendo uma nova lista de posts
      const newList1 = post_list_full_test1
      worker.Action({
        description: worker.ACTION_STACK_NEW_POSTS,
        value: newList1
      });

      expect(worker.GetPostToSendStack()).toEqual([
        ...post_list_full,
        post_full_test1_to_send,
      ]);

      // Executando novo processamento
      jest.runOnlyPendingTimers();

      expectObservable(worker.WorkerEvent$).toBe('---e', {
        e: {
          description: worker.EVENT_ACESSIBILIT_POST_SENT,
          value: post_full_test1_to_send
        } as IWorker<IPost>
      });

      testScheduler.flush();

    
      // Recebendo uma nova lista de posts
      const newList2 = post_list_full_test2
      worker.Action({
        description: worker.ACTION_STACK_NEW_POSTS,
        value: newList2
      });

      expect(worker.GetPostToSendStack()).toEqual([
        ...post_list_full,
        post_full_test1_to_send,
        post_list_full_test2,
      ]);

      // Executando novo processamento
      jest.runOnlyPendingTimers();

      expectObservable(worker.WorkerEvent$).toBe('---e', {
        e: {
          description: worker.EVENT_ACESSIBILIT_POST_SENT,
          value: post_list_full_test2[0]
        } as IWorker<IPost>
      });

      testScheduler.flush();
    });
  });

});