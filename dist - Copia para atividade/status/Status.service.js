"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const rxjs_1 = require("rxjs");
const axios_1 = __importDefault(require("axios"));
const Post_1 = require("../posts/Post");
class StatusService {
    constructor() {
        this.LIMIT_STATUS_CHARACTER = 500;
        this.Status$ = new rxjs_1.Subject();
    }
    async Post(status) {
        try {
            await axios_1.default.post(`https://${process.env.INSTANCE_URL}/api/v1/statuses`, Object.assign(Object.assign({}, status), { status: status.status.substring(0, this.LIMIT_STATUS_CHARACTER) }), {
                headers: {
                    Authorization: `Bearer ${process.env.MASTODON_KEY}`,
                },
            }).then(toot => {
                const post = new Post_1.Post();
                this.Status$.next(post.ConvertMastodonToot(toot));
            }).catch(err => {
                this.Status$.error(err);
            });
        }
        catch (err) {
            this.Status$.error(err);
        }
    }
}
exports.StatusService = StatusService;
