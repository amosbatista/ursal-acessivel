import { TimelineMastodonService  } from "./timeline/Timeline.Mastodon.service";
import { Timeline, ITimeline} from "./timeline/Timeline";
import { TimelineFactory } from "./persistence/PersistenseFactory";
import { Runner } from "./Runner";
import { IPost } from "./posts/Post";
import { IUser } from './users/User'
import StackHelper from "./Stack";
import { StatusService } from "./status/Status.service";
import {  CreateStatusForNonAcessiblePost } from "./status/Status";

console.log("requisição bookmark");

const TIMELINE_REFRESH_SECONDS = 600;
const STATUS_REFRESH_SECONDS = 60;

let lastTimeline: ITimeline;

const timelinePersistence = TimelineFactory();

const timelineRunner = new Runner(TIMELINE_REFRESH_SECONDS);
const timelineService = new TimelineMastodonService();
const postsWithoutAcessibilty = new StackHelper(
  new Array<IPost>(),
  "Posts sem acessibilidade",
  console,
  false
);
const sentStatusList = new StackHelper(
  new Array<IPost>(),
  "Posts com status enviado",
  console,
  true
);

const usersAlreadyWarned = new StackHelper(
  new Array<IUser>(),
  "Usuários já acionados",
  console,
  true
);

timelineService.timeline$.subscribe({

  next: (timelinePosts: ITimeline ) => {
    timelineRunner.FreeToAnotherRun();

    lastTimeline = timelinePosts;
    timelinePersistence.SaveData(timelinePosts);
    
    const timeline = new Timeline(timelinePosts);
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
  },error: (err) => {
    timelineRunner.FreeToAnotherRun()
    console.log('Erro ao consultar timeline', err)
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
})


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
timelinePersistence.LoadedData$.subscribe({
  next: (loaded: ITimeline) => {
    console.log('carregada timeline')

    lastTimeline = loaded;

    timelineRunner.Init(() => {
      timelineService.LoadTimeline(lastTimeline.minId) 
    });
  }
});


timelinePersistence.LoadData();




const shouldPostSendToReturnList = (
  post: IPost,
  usersAlreadyWarned: IUser[],
  ):boolean => {
    
  return  usersAlreadyWarned.find(user => {
    return user.id == post.user.id
  }) ? false : true;

}

export {shouldPostSendToReturnList}


