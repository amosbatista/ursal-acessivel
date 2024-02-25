import { Observable, of } from "rxjs";
import { ITimeline } from "./ITimeline";
import { IWorker } from "../worker/IWorker";
import { Runner } from "../Runner";
import { Worker } from "../worker/Worker";
import { TimelineFactory } from "../persistence/PersistenseFactory";
import { IPersistence } from "../persistence/IPersistence";
import { ITimelineService, TimelineMastodonService } from "./Timeline.Mastodon.service";
import { Timeline } from "./Timeline.helpers";
import { IPost } from "../posts/Post";

export class TimelineWorker extends Worker<ITimeline, IPost[]> {
  Action(content: IWorker<ITimeline>): void {
    throw new Error("Method not implemented.");
  }
  timeline: ITimeline = {
    minId: '0',
    posts: []
  };

  TIMELINE_ENTRY_DESCRIPTION = 'leitura timeline'
  POST_EMIT_DESCRIPTION = 'toots sem descrição'
  TIMELINE_READ_ERROR = 'erro leitura timeline'

  constructor (
    private persistence: any = TimelineFactory(),
    private service: any = new TimelineMastodonService(),
    timelineRefreshSeconds: number = 60,
  ) {
    super(timelineRefreshSeconds);
    this.SubscribeService();
    this.SetExecutable();
  }
  SetExecutable(): void {
    super.SetExecutable(() => {
      this.service.LoadTimeline(this.timeline.minId);
    })
  }

  CreateTimelineRunner(): Runner {
    return new Runner(super.GetTimelineReferesh());
  }
  Load(): Observable<IWorker<ITimeline>> {

    return new Observable<IWorker<ITimeline>>((subscribe => {

      this.persistence.LoadedData$.subscribe((loaded: IPersistence<ITimeline>)=> {

        if(loaded.persistenceError && !loaded.persistenceError.isErrorNoFile) {
          subscribe.next({
            description: this.TIMELINE_ENTRY_DESCRIPTION,
            error: {
              message: 'Erro ao carregar arquivo timeline',
              data: loaded.persistenceError?.errorData
            },
          });

          return;
        }
        if(loaded.persistenceError?.isErrorNoFile) {
          this.persistence.SavedData$.subscribe((saved: IPersistence<ITimeline>) => {

            if(saved.persistenceError) {
              subscribe.next({
                description: this.TIMELINE_ENTRY_DESCRIPTION,
                error: {
                  message: 'Erro ao iniciar arquivo timeline',
                  data: saved.persistenceError?.errorData
                },
              });
              return;
            }

            if(!saved.content) {
              subscribe.next({
                description: this.TIMELINE_ENTRY_DESCRIPTION,
                error: {
                  message: 'Timeline foi salva sem conteúdo',
                  data: null
                },
              });
              return;
            }
            
            this.timeline = saved.content;
            subscribe.next({
              description: this.TIMELINE_ENTRY_DESCRIPTION,
              value: saved.content,
            });
          });

          const timelineToSave = this.GenerateEmptyTimeline();
          this.timeline = timelineToSave;
          this.persistence.SaveData({
            timeLine: timelineToSave
          })
          return;
        }

        if(!loaded.content) {
          subscribe.next({
            description: this.TIMELINE_ENTRY_DESCRIPTION,
            error: {
              message: 'Timeline foi carregada sem erro, mas vazia',
              data: null
            },
          });

          return;
        }
        
        this.timeline = loaded.content;
        subscribe.next({
          description: this.TIMELINE_ENTRY_DESCRIPTION,
          value: loaded.content,
        });        
      });
      this.persistence.LoadData();  
    }))
  }
  SubscribeService() {
    this.service.timeline$.subscribe((timelineResult: ITimelineService) => {
      this.runner?.FreeToAnotherRun();
    
      if(!timelineResult.timeline) {
        
        if(timelineResult.error) {
          this.WorkerEvent$.next({
            description: this.TIMELINE_READ_ERROR,
            error: {
              message: timelineResult.error?.message,
              data: timelineResult.error?.objectError
            }
          });
          return;
        }
        this.WorkerEvent$.next({
          description: this.TIMELINE_READ_ERROR,
          error: {
            message: 'timeline retornou vazia',
            data: null
          }
        });
        return;
      }
      this.timeline = timelineResult.timeline;
      
      this.persistence.SaveData(timelineResult.timeline);

      const helper = new Timeline(timelineResult.timeline);
      const postsWithoutAcessibilty: IPost[] = helper.GetLocalPostswithoutDescription();

      if(postsWithoutAcessibilty.length > 0) {
      this.WorkerEvent$.next({
        description: this.POST_EMIT_DESCRIPTION,
        value: postsWithoutAcessibilty
        });
      }
    })
  }
  GenerateEmptyTimeline (): ITimeline {
    return {
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
  }
}