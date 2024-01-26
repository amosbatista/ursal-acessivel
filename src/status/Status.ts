import { IPost } from "../posts/Post";

interface IStatus {
  status: string,
}

function CreateStatusForNonAcessiblePost (post:IPost): IStatus {
  return {
    status: (process.env.DM_MSG || '')
      .replace('@${post.user.userName}', post.user.userName)
      .replace('${post.url}', post.url)
      .replace('${process.env.INSTANCE_NAME}', process.env.INSTANCE_NAME || '')
  }
}

export { IStatus, CreateStatusForNonAcessiblePost }