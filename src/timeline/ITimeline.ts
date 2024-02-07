import { IPost } from "../posts/Post";

export interface ITimeline {
  posts: IPost[],
  minId: string
}