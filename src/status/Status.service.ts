import { IStatus } from "./Status"
import { Subject } from 'rxjs';
import axios from 'axios';
import { Post, IPost } from "../posts/Post";

class StatusService {

    Status$ = new Subject<IPost>();

    async Post(status: IStatus) {
      /*console.log('novo status', status)
      this.Status$.next({
        content: "foo",
        id: "1",
        url: "https://ursal.zone/users/teste/statuses/123445",
        user: {
          id: "1",
          userName: "foo"
        },
        creationData: '2023-02-17T19:47:15.598Z',
        media: [{
          id: "1",
          description: "",
          type: "",
          url: "https://ursal.zone/users/teste/statuses/123445"
        }]
      });*/
      try{
        console.log("disparando status")
        await axios.post('https://ursal.zone/api/v1/statuses', 
          {...status,
            visibility: 'direct'
          }, {
            headers: {
              Authorization: 'Bearer NGNCoXx5Pm7GxM_1wpHTrNRZrdRlMvAMrudEzMdH5hc',
            },
          }
        ).then(toot => {
          const post = new Post();

          this.Status$.next(post.ConvertMastodonToot(toot));
        }).catch(err => {
          this.Status$.error(err);
        })
      }
      catch(err) {
        this.Status$.error(err);
      }
    }
}
export { StatusService }