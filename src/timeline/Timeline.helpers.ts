import { 
  IPost,
} from "../posts/Post"
import { ITimeline } from "./ITimeline"

class Timeline {

  constructor(
    private list: ITimeline
  ){}

  GetLocalPostswithoutDescription(): IPost[] {
    return this.list.posts.filter((post) => {
      return (post.media.find(media => {
        return media.description == "" || media.description == null
      })
      ) && (post.url.search(process.env.INSTANCE_URL || '') > 0)
    })
  }
}

export { ITimeline, Timeline }