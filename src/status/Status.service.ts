import { IStatus } from "./Status"
import { Subject } from 'rxjs';
import axios from 'axios';
import { Post, IPost } from "../posts/Post";

class StatusService {

    LIMIT_STATUS_CHARACTER = 500;
    Status$ = new Subject<IPost>();

    async Post(status: IStatus) {
      try{
        await axios.post(`https://${process.env.INSTANCE_URL}/api/v1/statuses`, 
          {
            ...status,
            status: status.status.substring(0, this.LIMIT_STATUS_CHARACTER)
          }, {
            headers: {
              Authorization: `Bearer ${process.env.MASTODON_KEY}`,
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