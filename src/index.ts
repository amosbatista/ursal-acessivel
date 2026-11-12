import { ActivityWorker } from './activity/Activity.worker';
import { MastodonAuthService } from './auth/MastodonAuth.service';
import { AcessibilityStatusWorker } from './status/AcessibilityStatus.worker';
import { StatusService } from './status/Status.service';
import { IStatus } from './status/Status';
import { TimelineWorker } from './timeline/TImeline.worker';
import { TimelineMastodonService } from './timeline/Timeline.Mastodon.service';
import { of, switchMap, throwError } from 'rxjs';
import 'dotenv/config';

const TIMELINE_REFRESH_SECONDS = 1 * 30;
const SEND_POST_REFRESH_SECONDS = 1 * 3;

const isErrorAtLoaded = (loaded: any): boolean => {
  if (loaded.error) {
    console.log(loaded.error.message, loaded.error.data);
    return true;
  }
  return false;
};

const Bootstrap = async (): Promise<void> => {
  console.log('Ursal Acessível - Validando autenticação do Mastodon.');

  const authService = new MastodonAuthService();
  const authenticatedAccount = await authService.Initialize();
  const statusService = new StatusService(authService);
  const timelineService = new TimelineMastodonService(authService);

  const timelineWorker = new TimelineWorker(undefined, timelineService, TIMELINE_REFRESH_SECONDS);
  const acessibilityWorker = new AcessibilityStatusWorker(undefined, statusService, SEND_POST_REFRESH_SECONDS);
  const activityWorker = new ActivityWorker(
    undefined,
    undefined,
    (Number.parseInt(process.env.REFRESH_TIME_ACTIVITY_HOURS || '12') * 60 * 60),
    statusService,
  );

  console.log(`Ursal Acessível - Conta ${authenticatedAccount} autenticada. Carregando dados.`);

  const setProcess = () => {
    timelineWorker.WorkerEvent$.subscribe({
      next: (timelineResult) => {
        const status: IStatus = {
          status: `@acessivel Update timeline: ${timelineResult.value ? timelineResult.value.length : ' sem toots'}`,
          visibility: 'direct',
        };
        statusService.Post(status).subscribe({
          error: (err) => console.log('Erro ao postar status', err),
        });

        if (timelineResult.description === timelineWorker.TIMELINE_READ_ERROR) {
          activityWorker.Action({ description: activityWorker.ACTION_TIMELINE_READ_ERROR });
          return;
        }

        if (timelineResult.description === timelineWorker.POST_EMIT_DESCRIPTION) {
          acessibilityWorker.Action({
            description: acessibilityWorker.ACTION_STACK_NEW_POSTS,
            value: timelineResult.value,
          });
        }
      },
    });

    acessibilityWorker.WorkerEvent$.subscribe({
      next: (acessibilityResult) => {
        if (acessibilityResult.description === acessibilityWorker.EVENT_POST_SENT_ERROR) {
          activityWorker.Action({ description: activityWorker.ACTION_SEND_POST_ERROR });
          return;
        }

        if (acessibilityResult.description === acessibilityWorker.EVENT_ACESSIBILIT_POST_SENT) {
          activityWorker.Action({ description: activityWorker.ACTION_NEW_ACESSIBILITY_POST });
        }
      },
    });
  };

  const initWorkers = () => {
    timelineWorker.SetExecutable();
    timelineWorker.Init();
    acessibilityWorker.SetExecutable();
    acessibilityWorker.Init();
    activityWorker.SetExecutable();
    activityWorker.Init();
  };

  timelineWorker.Load().pipe(
    switchMap((timelineLoaded) => {
      if (isErrorAtLoaded(timelineLoaded)) {
        return throwError(() => new Error('Falha ao carregar a timeline.'));
      }
      return acessibilityWorker.Load();
    }),
    switchMap((acessibilityLoaded) => {
      if (isErrorAtLoaded(acessibilityLoaded)) {
        return throwError(() => new Error('Falha ao carregar os posts enviados.'));
      }
      return activityWorker.Load();
    }),
    switchMap((activityLoaded) => {
      if (isErrorAtLoaded(activityLoaded)) {
        return throwError(() => new Error('Falha ao carregar a atividade.'));
      }
      return of(true);
    }),
  ).subscribe({
    next: () => {
      console.log('Ursal Acessível - Carregamento finalizado. Configurando processamento...');
      setProcess();

      console.log('Ursal Acessível - Iniciando processadores...');
      initWorkers();

      const status: IStatus = {
        status: '@acessivel Iniciado processamento após verificação inicial...',
        visibility: 'direct',
      };
      statusService.Post(status).subscribe({
        error: (err) => console.log(err),
      });
    },
    error: (error) => {
      console.error(`Ursal Acessível - Inicialização interrompida: ${error.message}`);
      process.exitCode = 1;
    },
  });
};

Bootstrap().catch((error: any) => {
  console.error(`Ursal Acessível - Não foi possível iniciar: ${error.message || 'erro desconhecido'}`);
  process.exitCode = 1;
});
