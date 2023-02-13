import { 
  IPost,
} from "../posts/Post"

interface ITimeline {
  posts: IPost[]
}


class Timeline {

  constructor(
    private list: ITimeline
  ){}

  GetLocalPostswithoutDescription(): IPost[] {
    return this.list.posts.filter((post) => {
      return (post.media.find(media => {
        return media.description == "" || media.description == null
      })
      ) && (post.url.search(/\/ursal.zone\//g) > 0)
    })
  }
}

export { ITimeline, Timeline }