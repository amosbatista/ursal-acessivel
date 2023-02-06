import { IUser } from "./User";

interface IPost {
  id: string,
  content: string,
  media: IMedia[],
  user: IUser,
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
      user: {
        id: toot.account.id,
        userName: toot.account.username,
      },
      media: toot.media_attachments.map((media: {
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