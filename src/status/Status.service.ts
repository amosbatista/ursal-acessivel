import { IStatus } from "./Status"
import axios from 'axios';
import { Post, IPost } from "../posts/Post";
import { Observable } from "rxjs";
import { IError } from "../IError";

interface IStatusResult {
  error?: IError, 
  content?: IPost
}
class StatusService {

    LIMIT_STATUS_CHARACTER = 500;
    
    Post(status: IStatus): Observable<IStatusResult> {
      return new Observable<IStatusResult>((subscriber) => {
        try{
          axios.post(`https://${process.env.INSTANCE_URL}/api/v1/statuses`, 
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
  
            subscriber.next({
              content: post.ConvertMastodonToot(toot)
            });
          }).catch(err => {
            subscriber.next({
              error: {
                message: 'Erro em serviço request',
                objectError: err
              }
            })
          });
        }
        catch(err) {
          subscriber.next({
            error: {
              message: 'Erro em serviço request',
              objectError: err
            }
          });
        }
      });
      
    }
}
export { StatusService, IStatusResult }