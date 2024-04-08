import { Observable } from "rxjs";
import { IWorker } from "../worker/IWorker";
import { Worker } from "../worker/Worker";
import { IActivity } from "./IActivity";
import { ActivityFactory } from "./Activity.persistence";
import { IPersistence } from "../persistence/IPersistence";
import { ActivityService } from "./Activity.service";
import moment from "moment";
import { StatusService } from "../status/Status.service";
import { ActivytyFormater } from "./Activity.formatter";
import { IStatus } from "../status/Status";

export class ActivityWorker extends Worker<IActivity, IActivity>{

  ACTIVITY_LOADED = 'atividade carregada'
  ACTION_NEW_ACESSIBILITY_POST = 'novo post erro acessibilidade'
  ACTION_TIMELINE_READ_ERROR = 'novo erro leitura timeline'
  ACTION_SEND_POST_ERROR = 'novo erro envio leitura'
  
  constructor (
    private persistence = ActivityFactory(),
    private activity = new ActivityService(moment),
    timelineRefreshSeconds: number = 60,
    private statusService = new StatusService(),
    private formatter = new ActivytyFormater(moment)
  ) {
    super(timelineRefreshSeconds);
  }

  Load(): Observable<IWorker<IActivity>> {
    return new Observable<IWorker<IActivity>>((subscriber) => {
      this.persistence.LoadedData$.subscribe((loaded: IPersistence<IActivity>)=> {

        if(loaded.persistenceError && !loaded.persistenceError.isErrorNoFile) {
          subscriber.next({
            description: this.ACTIVITY_LOADED,
            error: {
              message: 'Erro ao carregar arquivo atividade',
              data: loaded.persistenceError?.errorData
            },
          });

          return;
        }
        if(loaded.persistenceError?.isErrorNoFile) {

          this.persistence.SavedData$.subscribe((saved:  IPersistence<IActivity>) => {

            if(saved.persistenceError) {
              subscriber.next({
                description: this.ACTIVITY_LOADED,
                error: {
                  message: 'Erro ao carregar arquivo atividade',
                  data: saved.persistenceError?.errorData
                },
              });
              return;
            }
            if(saved.content) {
              this.activity.Load(saved.content)
            }
            else {
              this.activity.Init()
            }

            subscriber.next({
              description: this.ACTIVITY_LOADED,
              value: this.activity.Get(),
            });
          });
          const initial = this.activity.Init();
          this.persistence.SaveData(initial);
          return;
        }

        if(loaded.content) {
          this.activity.Load(loaded.content)
        }
        subscriber.next({
          description: this.ACTIVITY_LOADED,
          value: loaded.content,
        });        
      });
      this.persistence.LoadData();  
    });
  }
  GetActivity() {
    return this.activity.Get();
  }
  Action(content: IWorker<IActivity>): void {
    if(content.description === this.ACTION_NEW_ACESSIBILITY_POST) {
      this.activity.RegisterNewAcessibilityFailedPost();
      this.persistence.SaveData(this.activity.Get());
    }

    if(content.description === this.ACTION_TIMELINE_READ_ERROR) {
      this.activity.RegisterNewTimelineReadError();
      this.persistence.SaveData(this.activity.Get());
    }

    if(content.description === this.ACTION_SEND_POST_ERROR) {
      this.activity.RegisterNewSendStatusError();
      this.persistence.SaveData(this.activity.Get());
    }
  }

  SetExecutable(): void {
    super.SetExecutable(() => {
      
      this.runner?.FreeToAnotherRun();
      const activityPost: IStatus = {
        status: this.WriteActivityPost(
          this.formatter.format(this.activity.Get())
        ),
        visibility: "public"
      }
      //this.statusService.Post(activityPost);
      console.log('pre activity')
      this.statusService.Post(activityPost).subscribe({
        next: (result) => {
          console.log('Resultado post', result)
        }
      });
    })
  }

  WriteActivityPost(acitivity: IActivity) {
    return `
      Registro de atividade do robô acessível:

      Última atividade: ${acitivity.today.LastActivity}, 
      Toots sem descrição alertados hoje: ${acitivity.today.AcessibilityFailedPosts}, 
      Erros de leitura de timeline, hoje: ${acitivity.today.TimelineReadingErrors}, 
      Falha de envio de toots, hoje: ${acitivity.today.PostSendErrors}, 

      Registros desde o início da operação, em ${acitivity.allTime.StartedAt}:
      Toots sem descrição alertados: ${acitivity.allTime.AcessibilityFailedPosts}, 
      Erros de leitura de timeline: ${acitivity.allTime.TimelineReadingErrors}, 
      Falha de envio de toots: ${acitivity.allTime.PostSendErrors}.
    `;
  }


}