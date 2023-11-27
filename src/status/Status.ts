import { IPost } from "../posts/Post";

interface IStatus {
  status: string,
}

function CreateStatusForNonAcessiblePost (post:IPost): IStatus {
  return {
    status: `${process.env.DM_MSG}`
  }
}

export { IStatus, CreateStatusForNonAcessiblePost }