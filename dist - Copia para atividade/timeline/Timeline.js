"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeline = void 0;
class Timeline {
    constructor(list) {
        this.list = list;
    }
    GetLocalPostswithoutDescription() {
        return this.list.posts.filter((post) => {
            return (post.media.find(media => {
                return media.description == "" || media.description == null;
            })) && (post.url.search(process.env.INSTANCE_URL || '') > 0);
        });
    }
}
exports.Timeline = Timeline;
