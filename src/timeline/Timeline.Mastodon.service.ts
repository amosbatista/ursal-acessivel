import { Subject } from 'rxjs';
import { ITimeline } from './Timeline.helpers';
import { Post } from '../posts/Post';
import axios from 'axios';
import { IError } from '../IError';
import { IAccessTokenProvider, MissingAccessTokenProvider } from '../auth/AccessTokenProvider';
import { SanitizeHttpError } from '../MastodonHttpError';

interface ITimelineService { 
  timeline: ITimeline | null ,
  error: IError | null
}
class TimelineMastodonService {

  timeline$ = new Subject<ITimelineService>();

  constructor(
    private tokenProvider: IAccessTokenProvider = new MissingAccessTokenProvider(),
    private httpClient: any = axios,
  ) {}

  LoadTimeline = async (minId: string) => {

    try{
      const urlSearch = `https://${process.env.INSTANCE_URL}/api/v1/timelines/public`;

      await this.httpClient.get(urlSearch, {
        params: {
          local: true,
          only_media: true,
          limit: 40,
          ...(minId !== '0' ? { min_id: minId } : {}),
        },
        headers: {
          Authorization: `Bearer ${this.tokenProvider.GetAccessToken()}`,
        }
      }).then((response: any) => {
        const lastPost = response.data.length - 1;
        if(!response.data[lastPost]) {
          this.timeline$.next({
            error: {
              message: 'timeline vazia',
              objectError: null
            },
            timeline: null
          });

          return;
        }
        const timeline:ITimeline = {
          minId: response.data[lastPost].id, 
          posts: response.data.map((toot:any) => {
            const post = new Post();
  
            return post.ConvertMastodonToot(toot);
          })
        }

        this.timeline$.next({
          error: null,
          timeline
        });
      }).catch((err: any) => {
        const safeError = SanitizeHttpError(err);
        this.timeline$.next({
          timeline: null,
          error: {
            message: 'erro na requisição timeline',
            objectError: safeError
          }
        });
      });
    }
    catch(err) {
      const safeError = SanitizeHttpError(err);
      this.timeline$.next({
        timeline: null,
        error: {
          message: 'erro na requisição timeline (try catch)',
          objectError: safeError
        }
      });      
    }


    
  }
}

export { TimelineMastodonService, ITimelineService }
