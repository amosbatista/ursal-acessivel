"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineStreamService = void 0;
const rxjs_1 = require("rxjs");
const ws_1 = __importDefault(require("ws"));
class TimelineStreamService {
    constructor(
    //private mastodonConnection: any
    ) {
        this.MastodomTimeline$ = new rxjs_1.Subject();
    }
    async heartbeat() {
        clearTimeout(this.pingTimeout);
        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        this.pingTimeout = setTimeout(() => {
            this.pingTimeout.terminate();
        }, 30000 + 1000);
    }
    Connect() {
        try {
            const wb = new ws_1.default('wss://ursal.zone/api/v1/streaming/public/local', {
                headers: {
                    Authorization: `Bearer ${process.env.MASTODON_KEY}`
                }
            });
            wb.on('error', console.error);
            wb.on('open', this.heartbeat);
            wb.on('ping', this.heartbeat);
            wb.on('close', () => {
                clearTimeout(this.pingTimeout);
            });
            wb.onopen = (e) => {
                console.log("conectado");
                wb.send("public:local");
            };
            wb.on('public:local', (test) => {
                console.log("recebido", test);
            });
            setTimeout(() => {
                wb.send("public:local");
                console.log("enviado");
            }, 5 * 1000);
            console.log("iniciado");
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.TimelineStreamService = TimelineStreamService;
