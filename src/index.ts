import { TimelineMastodonService  } from "./timeline/Timeline.Mastodon.service";
import { Timeline, ITimeline} from "./timeline/Timeline";
import { TimelineFactory, SentPostFactory } from "./persistence/PersistenseFactory";
import { Runner } from "./Runner";
import { IPost } from "./posts/Post";
import { IUser } from './users/User'
import StackHelper from "./Stack";
import { StatusService } from "./status/Status.service";
import {  CreateStatusForNonAcessiblePost } from "./status/Status";
import { combineLatest } from 'rxjs';

console.log("requisição bookmark");

const TIMELINE_REFRESH_SECONDS = 900;
const STATUS_REFRESH_SECONDS = 360;

let lastTimeline: ITimeline;

const timelinePersistence = TimelineFactory();
const sentPostPersistence = SentPostFactory();

const timelineRunner = new Runner(TIMELINE_REFRESH_SECONDS);
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
  true
);

const sentStatusList = new StackHelper(
  new Array<IPost>(),
  "Posts com status enviado",
  console,
  true
);

timelineService.timeline$.subscribe({

  next: (timelinePosts ) => {

    timelineRunner.FreeToAnotherRun();

    if(timelinePosts.error)  {
      console.log(timelinePosts.error.message, timelinePosts.error.objectError);
    }
    else {
      if(timelinePosts.timeline) {

      
        lastTimeline = timelinePosts.timeline;
        timelinePersistence.SaveData(timelinePosts.timeline);
        
        const timeline = new Timeline(timelinePosts.timeline);
        const getPostsWithoutAcessibility = timeline.GetLocalPostswithoutDescription();

        if(getPostsWithoutAcessibility.length <= 0) {
          console.log("Não há toots com problemas")
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
    console.log('Post criado para o usuário ', post.user.userName)
  },
  error: (err) => {
    returnStatusRunner.FreeToAnotherRun()
    console.log('Erro ao postar status: ', err)
  },
})



timelinePersistence.SavedData$.subscribe({
  next: () => {
    console.log("Timeline atualizada");
  }
});

sentPostPersistence.SavedData$.subscribe({
  next: () => {
    console.log("Lista de posts a serem enviadas atualizada");
  }
});




// Status post processor
const returnStatusRunner = new Runner(STATUS_REFRESH_SECONDS);
returnStatusRunner.Init(() => {
  const postToReturn = postsWithoutAcessibilty.Top();
  if(postToReturn) {
    const status = CreateStatusForNonAcessiblePost(postToReturn);

    statusService.Post(status);
  }
  else {
    console.log("lista de retorno vazia")
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
    console.log('carregada timeline e posts')

    lastTimeline = timelineLoaded;
    sentPostsLoaded.forEach(sentPost => {
      sentStatusList.Add(sentPost);
    });

    timelineRunner.Init(() => {
      timelineService.LoadTimeline(lastTimeline.minId) 
    });
  }
})


timelinePersistence.LoadData();
sentPostPersistence.LoadData();
console.log("env", process.env.MASTODON_KEY)



const shouldPostSendToReturnList = (
  post: IPost,
  usersAlreadyWarned: IUser[],
  ):boolean => {
    
  return  usersAlreadyWarned.find(user => {
    return user.id == post.user.id
  }) ? false : true;

}



export {shouldPostSendToReturnList}


