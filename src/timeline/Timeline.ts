import { 
  IPost,
} from "../posts/Post"

interface ITimeline {
  posts: IPost[],
  minId: string
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
      ) && (post.url.search(/\/${process.env.INSTANCE_URL}\//g) > 0)
    })
  }
}

export { ITimeline, Timeline }