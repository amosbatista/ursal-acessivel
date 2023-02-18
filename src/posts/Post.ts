import { IUser } from "../users/User";

interface IPost {
  id: string,
  content: string,
  url: string,
  media: IMedia[],
  user: IUser,
  creationData: string,
}


interface IMedia {
  id: string,
  url: string,
  description: string | null
  type: string,
}

class Post {

  ConvertMastodonToot(toot: any): IPost {
    return {
      id: toot.id,
      content: toot.content,
      url: toot.url,
      creationData: toot.created_at,
      user: {
        id: toot.account?.id,
        userName: toot.account?.username,
      },
      media: toot.media_attachments?.map((media: {
        description: any; id: any; url: any; type: any
      })  => ({
        id: media.id,
        url: media.url,
        description: media.description,
        type: media.type
      }))
    }
  }
}

export { 
  IPost,
  IMedia,
  Post,
} 