"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStatusForNonAcessiblePost = void 0;
function CreateStatusForNonAcessiblePost(post) {
    return {
        visibility: 'direct',
        status: (process.env.DM_MSG || '')
            .replace('@${post.user.userName}', post.user.userName)
            .replace('${post.url}', post.url)
            .replace('${process.env.INSTANCE_NAME}', process.env.INSTANCE_NAME || '')
    };
}
exports.CreateStatusForNonAcessiblePost = CreateStatusForNonAcessiblePost;
