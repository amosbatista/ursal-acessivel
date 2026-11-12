import { IStatus } from "./Status"
import axios from 'axios';
import { Post, IPost } from "../posts/Post";
import { Observable } from "rxjs";
import { IError } from "../IError";
import { IAccessTokenProvider, MissingAccessTokenProvider } from "../auth/AccessTokenProvider";
import { SanitizeHttpError } from "../MastodonHttpError";

interface IStatusResult {
  error?: IError, 
  content?: IPost
}
class StatusService {

    LIMIT_STATUS_CHARACTER = 500;

    constructor(
      private tokenProvider: IAccessTokenProvider = new MissingAccessTokenProvider(),
      private httpClient: any = axios,
    ) {}
    
    Post(status: IStatus): Observable<IStatusResult> {
      return new Observable<IStatusResult>((subscriber) => {
        try{
          this.httpClient.post(`https://${process.env.INSTANCE_URL}/api/v1/statuses`,
            {
              ...status,
              status: status.status.substring(0, this.LIMIT_STATUS_CHARACTER)
            }, {
              headers: {
                Authorization: `Bearer ${this.tokenProvider.GetAccessToken()}`,
              },
            }
          ).then((toot: any) => {
            const post = new Post();
  
            subscriber.next({
              content: post.ConvertMastodonToot(toot)
            });
          }).catch((err: any) => {
            subscriber.next({
              error: {
                message: 'Erro em serviço request',
                objectError: SanitizeHttpError(err)
              }
            })
          });
        }
        catch(err) {
          subscriber.next({
            error: {
              message: 'Erro em serviço request',
              objectError: SanitizeHttpError(err)
            }
          });
        }
      });
      
    }
}
export { StatusService, IStatusResult }
