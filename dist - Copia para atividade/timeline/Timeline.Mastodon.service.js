"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineMastodonService = void 0;
const rxjs_1 = require("rxjs");
const Post_1 = require("../posts/Post");
const axios_1 = __importDefault(require("axios"));
class TimelineMastodonService {
    constructor() {
        this.timeline$ = new rxjs_1.Subject();
        this.LoadTimeline = async (minId) => {
            try {
                const urlSearch = `https://${process.env.INSTANCE_URL}/api/v1/timelines/public?local=true&only_media=true&limit=40
      ${minId != "0" ? `&min_id=${minId}` : ''} `;
                // console.log("iniciando listagem timeline", urlSearch)
                await axios_1.default.get(urlSearch, {
                    headers: {
                        Autorizathion: `Bearer ${process.env.MASTODON_KEY}`,
                    }
                }).then(response => {
                    const lastPost = response.data.length - 1;
                    if (!response.data[lastPost]) {
                        // console.log('Obj response com problemas', response);
                    }
                    const timeline = {
                        minId: response.data[lastPost].id,
                        posts: response.data.map((toot) => {
                            const post = new Post_1.Post();
                            return post.ConvertMastodonToot(toot);
                        })
                    };
                    this.timeline$.next({
                        error: null,
                        timeline
                    });
                }).catch(err => {
                    this.timeline$.next({
                        timeline: null,
                        error: {
                            message: 'erro na requisição timeline',
                            objectError: err
                        }
                    });
                });
            }
            catch (err) {
                this.timeline$.next({
                    timeline: null,
                    error: {
                        message: 'erro na requisição timeline (try catch)',
                        objectError: err
                    }
                });
            }
            /*this.timeline$.next({
              posts: [{
                content: "foo",
                id: "1",
                user: {
                  id: "1",
                  userName: "foo"
                },
                media: [{
                  id: "1",
                  description: "",
                  type: "",
                  url: ""
                }]
              }]
            })
            console.log("executado")
            */
        };
    }
}
exports.TimelineMastodonService = TimelineMastodonService;
