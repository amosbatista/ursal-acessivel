import { TimelineMastodonService  } from "./timeline/Timeline.Mastodon.service";
import { Timeline, ITimeline} from "./timeline/Timeline";
import { Runner } from "./Runner";
import { IPost } from "./posts/Post";
import { IUser } from './User'
import StackHelper from "./Stack";
import { StatusService } from "./status/Status.service";
import {  CreateStatusForNonAcessiblePost } from "./status/Status";

console.log("requisição bookmark");

const TIMELINE_REFRESH_SECONDS = 50;
const STATUS_REFRESH_SECONDS = 200;

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

timelineService.timeline$.subscribe({

  next: (timelinePosts: ITimeline ) => {
    timelineRunner.FreeToAnotherRun()
    
    const timeline = new Timeline(timelinePosts);
    const getPostsWithoutAcessibility = timeline.GetLocalPostswithoutDescription();

    getPostsWithoutAcessibility.forEach(post => {
      if(shouldPostSendToReturnList(post, usersAlreadyWarned.Get())) {
        postsWithoutAcessibilty.Add(post)
      }
    })
  },error: (err) => {
    timelineRunner.FreeToAnotherRun()
    console.log('Erro ao consultar timeline', err)
  }
})

timelineRunner.Init(() => {
  timelineService.LoadTimeline() 
});



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

const returnStatusRunner = new Runner(STATUS_REFRESH_SECONDS);


returnStatusRunner.Init(() => {
  const postToReturn = postsWithoutAcessibilty.Top();
  if(postToReturn) {
    const status = CreateStatusForNonAcessiblePost(postToReturn);

    statusService.Post(status);
  }
})





const shouldPostSendToReturnList = (
  post: IPost,
  usersAlreadyWarned: IUser[],
  ):boolean => {
    
  return  usersAlreadyWarned.find(user => {
    return user.id == post.user.id
  }) ? false : true;

}

export {shouldPostSendToReturnList}


//import { TimelineStreamService } from "./timeline/Timeline.stream.service";


//const stream = new TimelineStreamService();
//stream.Connect()

//while(true ) {
  
//}