import { TimelineMastodonService  } from "./timeline/Timeline.Mastodon.service";
//import { ITimeline } from "./timeline/Timeline";
import { Runner } from "./Runner";

/*console.log("requisição bookmark");

const runner = new Runner();

const timelineService = new TimelineMastodonService();

timelineService.timeline$.subscribe({

  next: (timeline) => {
    runner.FreeToAnotherRun()
    
    timeline.posts.forEach(post => {
      console.log("post: ", post.content)
      console.log("user: ", post.user.userName)
    })
  }
})

runner.Init(() => {
  timelineService.LoadTimeline() 
});

*/



import { TimelineStreamService } from "./timeline/Timeline.stream.service";


const stream = new TimelineStreamService();


while(true ) {
  
}