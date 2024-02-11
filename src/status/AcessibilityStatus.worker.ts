import { Observable } from "rxjs";
import { IWorker } from "../worker/IWorker";
import { Worker } from "../worker/Worker";
import { IPost } from "../posts/Post";
import { SentPostFactory } from "../persistence/PersistenseFactory";
import { IStatusResult, StatusService } from "./Status.service";
import { IPersistence } from "../persistence/IPersistence";
import { CreateStatusForNonAcessiblePost, IStatus } from "./Status";

export class AcessibilityStatusWorker extends Worker<IPost[], IPost> {

  ACESSIBILITY_POST_DESCRIPTION = 'envio alerta acessibilidade';
  EVENT_ACESSIBILIT_POST_SENT = 'evento post efetuado';
  EVENT_POST_SENT_ERROR = 'evento erro envio post';
  ACTION_STACK_NEW_POSTS = 'adicionar novos posts';

  private sentPostList: IPost[] = [];
  private postsToSend: IPost[] = [];

  constructor (
    private persistence: any = SentPostFactory(),
    private service: any = new StatusService(),
    timelineRefreshSeconds: number = 60
  ) {
    super(timelineRefreshSeconds);
  }

  Load(): Observable<IWorker<IPost[]>> {
    return new Observable<IWorker<IPost[]>>((subscriber) => {
      this.persistence.LoadedData$.subscribe((loaded: IPersistence<IPost[]>)=> {

        if(loaded.persistenceError && !loaded.persistenceError.isErrorNoFile) {
          subscriber.next({
            description: this.ACESSIBILITY_POST_DESCRIPTION,
            error: {
              message: 'Erro ao carregar arquivo posts enviados',
              data: loaded.persistenceError?.errorData
            },
          });

          return;
        }
        if(loaded.persistenceError?.isErrorNoFile) {
          this.persistence.SavedData$.subscribe((saved:  IPersistence<IPost[]>) => {

            if(saved.persistenceError) {
              subscriber.next({
                description: this.ACESSIBILITY_POST_DESCRIPTION,
                error: {
                  message: 'Erro ao iniciar arquivo posts enviados',
                  data: saved.persistenceError?.errorData
                },
              });
              return;
            }
            this.sentPostList = this.sentPostList.concat(saved.content || this.GenerateEmptyPostList());

            subscriber.next({
              description: this.ACESSIBILITY_POST_DESCRIPTION,
              value: saved.content,
            });
          });

          this.persistence.SaveData(this.GenerateEmptyPostList())
          return;
        }
        this.sentPostList = this.sentPostList.concat(loaded.content || this.GenerateEmptyPostList());

        subscriber.next({
          description: this.ACESSIBILITY_POST_DESCRIPTION,
          value: loaded.content,
        });        
      });
      this.persistence.LoadData();  
    });
  }
  Action(content: IWorker<IPost[]>): void {

    if(this.ACTION_STACK_NEW_POSTS) {
      
      if (content.value) {
        content.value.forEach((post: IPost) => {
          if(this.IsPostNeverSent(post) ) {
            this.postsToSend.push(post);
          }
        });
      }
    }
  }
  SendPost(post: IPost) {
    this.service.Post(
      CreateStatusForNonAcessiblePost(post)
    ).subscribe({
      next: (result: IStatusResult)  => {

        if (result.error) {
          this.Emit({
            description: this.EVENT_POST_SENT_ERROR,
            error: {
              message: 'Erro ao escrever post de alerta acessibilidade',
              data: `${result.error.message} - ${typeof result.error.objectError === 'string' ? result.error.objectError : JSON.stringify(result.error.objectError)}`
            }
          });

          return;
        }
        this.Emit({
          description: this.EVENT_ACESSIBILIT_POST_SENT,
          value: post
        });
        this.sentPostList.push(post);
        this.PersistSentPostList();
      },
    })
  }
  SetExecutable(): void {
    super.SetExecutable(() => {
      const postToSend = this.GetTheTopPostToSend();

      if(postToSend) {
        this.SendPost(postToSend);
      }

      this.runner?.FreeToAnotherRun();
    })
  }
  PersistSentPostList() {
    this.persistence.SaveData(this.sentPostList);
  }
  GenerateEmptyPostList(): IPost[] {
    return [];
  }
  IsPostNeverSent(post: IPost): boolean {
    return this.sentPostList.find((sentStatus: IPost) => (
      sentStatus.id === post.id
    )) ? false : true;
  }
  GetPostToSendStack(): IPost[] {
    return this.postsToSend.slice(0);
  }
  GetTheTopPostToSend(): IPost | undefined {
    return this.postsToSend.shift();
  }
  
}