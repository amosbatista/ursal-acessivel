import { IMedia, IPost, Post } from "./Post";
import { IUser } from "./User";

describe('Post teste', () => {

  const mastodonPost =  {
    "id": "109818965783514846",
    "created_at": "2023-02-06T17:27:01.000Z",
    "in_reply_to_id": null,
    "in_reply_to_account_id": null,
    "sensitive": false,
    "spoiler_text": "",
    "visibility": "public",
    "language": "en",
    "uri": "https://bots.rumiancev.com/users/mastobara_bot/statuses/109818964969682119",
    "url": "https://bots.rumiancev.com/@mastobara_bot/109818964969682119",
    "replies_count": 0,
    "reblogs_count": 0,
    "favourites_count": 0,
    "edited_at": null,
    "content": "<p>capybara take me to see them</p><p>by umadesign in r/capybara</p><p>Link: <a href=\"https://reddit.com/r/capybara/comments/10v5hnt/capybara_take_me_to_see_them/\" rel=\"nofollow noopener noreferrer\" target=\"_blank\"><span class=\"invisible\">https://</span><span class=\"ellipsis\">reddit.com/r/capybara/comments</span><span class=\"invisible\">/10v5hnt/capybara_take_me_to_see_them/</span></a></p><p><a href=\"https://bots.rumiancev.com/tags/capybara\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>capybara</span></a> <a href=\"https://bots.rumiancev.com/tags/cute\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>cute</span></a> <a href=\"https://bots.rumiancev.com/tags/animals\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>animals</span></a> <a href=\"https://bots.rumiancev.com/tags/TeamCapy\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>TeamCapy</span></a></p>",
    "reblog": null,
    "account": {
        "id": "109375662898388125",
        "username": "mastobara_bot",
        "acct": "mastobara_bot@bots.rumiancev.com",
        "display_name": "Capybaras on Fedi (Mastobara)",
        "locked": false,
        "bot": true,
        "discoverable": true,
        "group": false,
        "created_at": "2022-11-20T00:00:00.000Z",
        "note": "<p>Spreading love for these amazing animals.</p><p>Subscribe for hourly <a href=\"https://bots.rumiancev.com/tags/capybara\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>capybara</span></a> content!</p><p>Made by <span class=\"h-card\"><a href=\"https://mstdn.ca/@ole\" class=\"u-url mention\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">@<span>ole</span></a></span></p><p>All images linked back to original sources.</p><p><a href=\"https://bots.rumiancev.com/tags/bot\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>bot</span></a> <a href=\"https://bots.rumiancev.com/tags/mastobot\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>mastobot</span></a></p>",
        "url": "https://bots.rumiancev.com/@mastobara_bot",
        "avatar": "https://cdn.masto.host/ursalzone/cache/accounts/avatars/109/375/662/898/388/125/original/676fea7ec984818a.jpg",
        "avatar_static": "https://cdn.masto.host/ursalzone/cache/accounts/avatars/109/375/662/898/388/125/original/676fea7ec984818a.jpg",
        "header": "https://cdn.masto.host/ursalzone/cache/accounts/headers/109/375/662/898/388/125/original/09834c74907b0678.jpg",
        "header_static": "https://cdn.masto.host/ursalzone/cache/accounts/headers/109/375/662/898/388/125/original/09834c74907b0678.jpg",
        "followers_count": 154,
        "following_count": 2,
        "statuses_count": 669,
        "last_status_at": "2023-02-06",
        "emojis": [],
        "fields": [
            {
                "name": "Created by",
                "value": "<span class=\"h-card\"><a href=\"https://mstdn.ca/@ole\" class=\"u-url mention\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">@<span>ole@mstdn.ca</span></a></span>",
                "verified_at": null
            }
        ]
    },
    "media_attachments": [
        {
            "id": "109818965692612911",
            "type": "image",
            "url": "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg",
            "preview_url": "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/small/08a37cd2bfe4f993.jpg",
            "remote_url": "https://bots.rumiancev.com/system/media_attachments/files/109/818/964/959/680/755/original/9eeba6c4da59a873.jpg",
            "preview_remote_url": null,
            "text_url": null,
            "meta": {
                "original": {
                    "width": 140,
                    "height": 140,
                    "size": "140x140",
                    "aspect": 1.0
                },
                "small": {
                    "width": 140,
                    "height": 140,
                    "size": "140x140",
                    "aspect": 1.0
                }
            },
            "description": null,
            "blurhash": "UZRVUXobyYkD%$t7t7jcyGV@RRWCiuo#R;oc"
        },
        {
          "id": "45645456",
          "type": "image",
          "url": "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg",
          "preview_url": "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/small/08a37cd2bfe4f993.jpg",
          "remote_url": "https://bots.rumiancev.com/system/media_attachments/files/109/818/964/959/680/755/original/9eeba6c4da59a873.jpg",
          "preview_remote_url": null,
          "text_url": null,
          "meta": {
              "original": {
                  "width": 140,
                  "height": 140,
                  "size": "140x140",
                  "aspect": 1.0
              },
              "small": {
                  "width": 140,
                  "height": 140,
                  "size": "140x140",
                  "aspect": 1.0
              }
          },
          "description": "capibara in a river",
          "blurhash": "UZRVUXobyYkD%$t7t7jcyGV@RRWCiuo#R;oc"
      }
      ]
    }

  it('deve receber um objeto status do Mastodon e retornar um objeto Post', () => {
    const expectedMedia1:IMedia = {
      id: "109818965692612911",
      type: "image",
      description: null,
      url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
    };
    const expectedMedia2:IMedia = {
      id: "45645456",
      type: "image",
      description: "capibara in a river",
      url: "https://cdn.masto.host/ursalzone/cache/media_attachments/files/109/818/965/692/612/911/original/08a37cd2bfe4f993.jpg"
    };
    const expectedUser: IUser = {
      id: "109375662898388125",
      userName: "mastobara_bot",
    };
    const expected:IPost = {
      id: "109818965783514846",
      content: "<p>capybara take me to see them</p><p>by umadesign in r/capybara</p><p>Link: <a href=\"https://reddit.com/r/capybara/comments/10v5hnt/capybara_take_me_to_see_them/\" rel=\"nofollow noopener noreferrer\" target=\"_blank\"><span class=\"invisible\">https://</span><span class=\"ellipsis\">reddit.com/r/capybara/comments</span><span class=\"invisible\">/10v5hnt/capybara_take_me_to_see_them/</span></a></p><p><a href=\"https://bots.rumiancev.com/tags/capybara\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>capybara</span></a> <a href=\"https://bots.rumiancev.com/tags/cute\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>cute</span></a> <a href=\"https://bots.rumiancev.com/tags/animals\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>animals</span></a> <a href=\"https://bots.rumiancev.com/tags/TeamCapy\" class=\"mention hashtag\" rel=\"nofollow noopener noreferrer\" target=\"_blank\">#<span>TeamCapy</span></a></p>",
      media: [
        expectedMedia1,
        expectedMedia2
      ],
      user: expectedUser
    };

    const post = new  Post();
    const actual = post.ConvertMastodonToot(mastodonPost);

    expect(expected).toEqual(actual);
  });
});