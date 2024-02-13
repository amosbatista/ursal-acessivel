"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    ConvertMastodonToot(toot) {
        var _a, _b, _c;
        return {
            id: toot.id,
            content: toot.content,
            url: toot.url,
            creationData: toot.created_at,
            user: {
                id: (_a = toot.account) === null || _a === void 0 ? void 0 : _a.id,
                userName: (_b = toot.account) === null || _b === void 0 ? void 0 : _b.username,
            },
            media: (_c = toot.media_attachments) === null || _c === void 0 ? void 0 : _c.map((media) => ({
                id: media.id,
                url: media.url,
                description: media.description,
                type: media.type
            }))
        };
    }
}
exports.Post = Post;
