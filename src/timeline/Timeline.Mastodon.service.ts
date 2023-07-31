import { Subject } from 'rxjs';
import { ITimeline } from './Timeline';
import { Post } from '../posts/Post';
import axios from 'axios';
import { IError } from '../IError';

class TimelineMastodonService {

  timeline$ = new Subject<{ 
    timeline: ITimeline | null ,
    error: IError | null
  }>();

  LoadTimeline = async (minId: string) => {

    try{
      const urlSearch = `https://ursal.zone/api/v1/timelines/public?local=true&only_media=true&limit=40
      ${ minId != "0" ? `&min_id=${minId}` : '' } `;

      console.log("iniciando listagem timeline", urlSearch)

      await axios.get(urlSearch, {
        headers: {
          Autorizathion: `Bearer ${process.env.MASTODON_KEY}`,
        }
      }).then(response => {
        const lastPost = response.data.length - 1;
        if(!response.data[lastPost]) {
          console.log('Obj response com problemas', response);
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
      }).catch(err => {
        this.timeline$.next({
          timeline: null,
          error: {
            message: 'erro na requisição timeline',
            objectError: err
          }
        });
      });
    }
    catch(err) {
      this.timeline$.next({
        timeline: null,
        error: {
          message: 'erro na requisição timeline (try catch)',
          objectError: err
        }
      });      
    }

    /*this.timeline$.next({
      posts: [{
        content: "foo",
        id: "1",
        user: {
          id: "1",
          userName: "foo"
        },
        media: [{
          id: "1",
          description: "",
          type: "",
          url: ""
        }]
      }]
    })
    console.log("executado")
    */

    
  }
}

export { TimelineMastodonService }