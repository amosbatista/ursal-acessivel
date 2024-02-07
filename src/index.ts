import { TimelineMastodonService  } from "./timeline/Timeline.Mastodon.service";
import { Timeline, ITimeline} from "./timeline/Timeline.helpers";
import { TimelineFactory, SentPostFactory } from "./persistence/PersistenseFactory";
import { Runner } from "./Runner";
import { IPost } from "./posts/Post";
import { IUser } from './users/User'
import StackHelper from "./Stack";
import { StatusService } from "./status/Status.service";
import {  CreateStatusForNonAcessiblePost } from "./status/Status";
import { combineLatest } from 'rxjs';
import 'dotenv/config'

const statusServiceForGeneralLog = new StatusService();

statusServiceForGeneralLog.Post({
  status: 'Robô acessível foi reiniciado e iniciará as análises de post em breve.',
  visibility: 'public'
});

const TIMELINE_REFRESH_SECONDS = 60 * 4;
const STATUS_REFRESH_SECONDS = 60 * 30;

let lastTimeline: ITimeline;

const timelinePersistence = TimelineFactory();
const sentPostPersistence = SentPostFactory();

const timelineRunner = new Runner(TIMELINE_REFRESH_SECONDS, 'Leitura Timeline');
const timelineService = new TimelineMastodonService();
const postsWithoutAcessibilty = new StackHelper(
  new Array<IPost>(),
  "Posts sem acessibilidade",
  console,
  false
);

const usersAlreadyWarned = new StackHelper(
  new Array<IUser>(),
  "Usuários já acionados",
  console,
  false
);

const sentStatusList = new StackHelper(
  new Array<IPost>(),
  "Posts com status enviado",
  console,
  false
);

timelineService.timeline$.subscribe({

  next: (timelinePosts ) => {

    timelineRunner.FreeToAnotherRun();

    if(timelinePosts.error)  {
      statusServiceForGeneralLog.Post({
        status: `${timelinePosts.error.message}: ${timelinePosts.error.objectError}`,
        visibility: 'public'
      });
    }
    else {
      if(timelinePosts.timeline) {

      
        lastTimeline = timelinePosts.timeline;
        timelinePersistence.SaveData(timelinePosts.timeline);
        
        const timeline = new Timeline(timelinePosts.timeline);
        const getPostsWithoutAcessibility = timeline.GetLocalPostswithoutDescription();

        if(getPostsWithoutAcessibility.length <= 0) {
          /*statusServiceForGeneralLog.Post({
            status: `Não há toots com problemas no momento.`,
            visibility: 'direct'
          });*/
          // console.log("Não há toots com problemas")
        }

        getPostsWithoutAcessibility.forEach(post => {
          if(shouldPostSendToReturnList(post, usersAlreadyWarned.Get())) {

            if(!sentStatusList.Get().find( (sentStatus: IPost) => {
              return sentStatus.id == post.id
            } )){
              sentStatusList.Add(post);
              postsWithoutAcessibilty.Add(post)
            }
          }
        })

        sentPostPersistence.SaveData(sentStatusList.Get());
      }
    }
  }
})


const statusService = new StatusService();

statusService.Status$.subscribe({
  next: (post: IPost) => {
    returnStatusRunner.FreeToAnotherRun()
  },
  error: (err) => {
    returnStatusRunner.FreeToAnotherRun()
    statusServiceForGeneralLog.Post({
      status: `Erro ao postar alerta de acessibilidade: ${err}`,
      visibility: 'direct'
    });
  },
})



timelinePersistence.SavedData$.subscribe({
  next: () => {
    // console.log("Timeline atualizada");
    /*statusServiceForGeneralLog.Post({
      status: `Timeline atualizada`,
      visibility: 'direct'
    });*/
  }
});

sentPostPersistence.SavedData$.subscribe({
  next: () => {
    statusServiceForGeneralLog.Post({
      status: `Lista de posts a serem enviadas atualizada com novos itens`,
      visibility: 'direct'
    });
    // console.log("Lista de posts a serem enviadas atualizada");
  }
});




// Status post processor
const returnStatusRunner = new Runner(STATUS_REFRESH_SECONDS, 'Alerta Acessibilidade');
returnStatusRunner.Init(() => {
  const postToReturn = postsWithoutAcessibilty.Top();
  if(postToReturn) {
    const status = CreateStatusForNonAcessiblePost(postToReturn);

    statusService.Post(status);
  }
  else {
    statusServiceForGeneralLog.Post({
      status: `Lista de retorno vazia`,
      visibility: 'direct'
    });
    // console.log("lista de retorno vazia")
    returnStatusRunner.FreeToAnotherRun()
  }
});




//  Timeline processor
combineLatest([
  timelinePersistence.LoadedData$,
  sentPostPersistence.LoadedData$
]).subscribe({
  next: ([
    timelineLoaded,
    sentPostsLoaded
  ]) => {
    statusServiceForGeneralLog.Post({
      status: `Posts já disparados e timeline carregados. Iniciando processamento`,
      visibility: 'public'
    });

    lastTimeline = timelineLoaded.content as unknown as ITimeline;
    sentPostsLoaded.content?.forEach(sentPost => {
      sentStatusList.Add(sentPost);
    });

    timelineRunner.Init(() => {
      timelineService.LoadTimeline(lastTimeline.minId) 
    });
  }
})

timelinePersistence.LoadData();
sentPostPersistence.LoadData();

const shouldPostSendToReturnList = (
  post: IPost,
  usersAlreadyWarned: IUser[],
  ):boolean => {
    
  return  usersAlreadyWarned.find(user => {
    return user.id == post.user.id
  }) ? false : true;

}



export {shouldPostSendToReturnList}


