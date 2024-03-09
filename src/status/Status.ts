import { IPost } from "../posts/Post";

interface IStatus {
  status: string,
  visibility: 'direct' | 'public' | 'private' | 'unlisted'
}

function CreateStatusForNonAcessiblePost (post:IPost): IStatus {
  return {
    visibility: 'direct',
    status: (process.env.DM_MSG || '')
      .replace('${post.user.userName}', post.user.userName)
      .replace('${post.url}', post.url)
      .replace('${process.env.INSTANCE_NAME}', process.env.INSTANCE_NAME || '')
      .replace(/\/n/g, '\n')
  }
}

export { IStatus, CreateStatusForNonAcessiblePost }