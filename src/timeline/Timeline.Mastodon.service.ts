import { Subject } from 'rxjs';
import { ITimeline } from './Timeline';
import { Post } from '../posts/Post';
import axios from 'axios';

class TimelineMastodonService {

  timeline$ = new Subject<ITimeline>();

  LoadTimeline = async (minId: string) => {

    try{
      const urlSearch = `https://ursal.zone/api/v1/timelines/public?local=true&only_media=true&limit=40
      ${ minId != "0" ? `&min_id=${minId}` : '' } `;

      console.log("iniciando listagem timeline", urlSearch)

      await axios.get(urlSearch, {
        headers: {
          Autorizathion: 'Bearer NGNCoXx5Pm7GxM_1wpHTrNRZrdRlMvAMrudEzMdH5hc',
        }
      }).then(response => {
        const lastPost = response.data.length - 1;
        const timeline:ITimeline = {
          minId: response.data[lastPost].id, 
          posts: response.data.map((toot:any) => {
            const post = new Post();
  
            return post.ConvertMastodonToot(toot);
          })
        }

        this.timeline$.next(timeline);
      }).catch(err => {
        console.log('erro na requisição timeline', err);
        this.timeline$.error("Erro ao gerar timeline");
      });
    }
    catch(err) {
      console.log('erro na requisição timeline (try catch)', err);
      this.timeline$.error("Erro ao gerar timeline");
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