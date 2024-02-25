import { ActivityWorker } from "./activity/Activity.worker";
import { AcessibilityStatusWorker } from "./status/AcessibilityStatus.worker";
import { TimelineWorker } from "./timeline/TImeline.worker";
import { Observable, combineLatest, of, pipe, switchMap, throwError } from 'rxjs';
import 'dotenv/config'
import { IWorker } from "./worker/IWorker";

const TIMELINE_REFRESH_SECONDS = 60 * 10;
const SEND_POST_REFRESH_SECONDS = 60 * 3;

const timelineWorker = new TimelineWorker(undefined, undefined, TIMELINE_REFRESH_SECONDS)
const acessibilityWorker = new AcessibilityStatusWorker(undefined, undefined, SEND_POST_REFRESH_SECONDS);
const activityWorker = new ActivityWorker(
  undefined, 
  undefined, 
  (Number.parseInt(process.env.REFRESH_TIME_ACTIVITY_HOURS || '12') * 60 * 60)
);

console.log('Ursal Acessível - Carregando e chacando ambiente.');


timelineWorker.Load().pipe(

  switchMap((timelineLoaded) => {
    if (isErrorAtLoaded(timelineLoaded)) { 
      return throwError(() => (new Error()));
    }
    return acessibilityWorker.Load();
  }),

  switchMap((acessibilityLoaded) => {
    if (isErrorAtLoaded(acessibilityLoaded)) { 
      return throwError(() => (new Error()));
    }
    return activityWorker.Load()}),

  switchMap((activityLoaded) => {
      if (isErrorAtLoaded(activityLoaded)) { 
        return throwError(() => (new Error()));
      }
      return of(true)}),

).subscribe({
  next: () => {

    console.log('Ursal Acessível - Checagem e carregamento finalizado. Configurando processamento...');
    setProcess();

    console.log('Ursal Acessível - Iniciando processadores...');
    initWorkers();
  }
})


const isErrorAtLoaded = (loaded: any): boolean => {
  if (loaded.error) {
    console.log(loaded.error.message, loaded.error.data)

    return true;
  }

  return false;
}

const setProcess = () => {
  timelineWorker.WorkerEvent$.subscribe({
    next: (timelineResult) => {

      if(timelineResult.description === timelineWorker.TIMELINE_READ_ERROR) {
        activityWorker.Action({
          description: activityWorker.ACTION_TIMELINE_READ_ERROR
        });

        return;
      }

      if(timelineResult.description === timelineWorker.POST_EMIT_DESCRIPTION) {
        acessibilityWorker.Action({
          description: acessibilityWorker.ACTION_STACK_NEW_POSTS,
          value: timelineResult.value
        });

        return;
      }
    }
  });

  acessibilityWorker.WorkerEvent$.subscribe({
    next: (acessibilityResult) => {

      if(acessibilityResult.description === acessibilityWorker.EVENT_POST_SENT_ERROR) {
        activityWorker.Action({
          description: activityWorker.ACTION_SEND_POST_ERROR
        });

        return;
      }

      if(acessibilityResult.description === acessibilityWorker.EVENT_ACESSIBILIT_POST_SENT) {
        activityWorker.Action({
          description: activityWorker.ACTION_NEW_ACESSIBILITY_POST
        });

        return;
      }
    }});
}

const initWorkers = () => {
  timelineWorker.SetExecutable();
  timelineWorker.Init();
  acessibilityWorker.SetExecutable();
  acessibilityWorker.Init();
  activityWorker.SetExecutable();
  acessibilityWorker.Init();
}