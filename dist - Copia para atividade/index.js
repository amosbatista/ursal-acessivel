"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldPostSendToReturnList = void 0;
const Timeline_Mastodon_service_1 = require("./timeline/Timeline.Mastodon.service");
const Timeline_1 = require("./timeline/Timeline");
const PersistenseFactory_1 = require("./persistence/PersistenseFactory");
const Runner_1 = require("./Runner");
const Stack_1 = __importDefault(require("./Stack"));
const Status_service_1 = require("./status/Status.service");
const Status_1 = require("./status/Status");
const rxjs_1 = require("rxjs");
require("dotenv/config");
const statusServiceForGeneralLog = new Status_service_1.StatusService();
statusServiceForGeneralLog.Post({
    status: 'Robô acessível foi reiniciado e iniciará as análises de post em breve.',
    visibility: 'public'
});
const TIMELINE_REFRESH_SECONDS = 90;
const STATUS_REFRESH_SECONDS = 360;
let lastTimeline;
const timelinePersistence = (0, PersistenseFactory_1.TimelineFactory)();
const sentPostPersistence = (0, PersistenseFactory_1.SentPostFactory)();
const timelineRunner = new Runner_1.Runner(TIMELINE_REFRESH_SECONDS, 'Leitura Timeline');
const timelineService = new Timeline_Mastodon_service_1.TimelineMastodonService();
const postsWithoutAcessibilty = new Stack_1.default(new Array(), "Posts sem acessibilidade", console, false);
const usersAlreadyWarned = new Stack_1.default(new Array(), "Usuários já acionados", console, false);
const sentStatusList = new Stack_1.default(new Array(), "Posts com status enviado", console, false);
timelineService.timeline$.subscribe({
    next: (timelinePosts) => {
        timelineRunner.FreeToAnotherRun();
        if (timelinePosts.error) {
            statusServiceForGeneralLog.Post({
                status: `${timelinePosts.error.message}: ${timelinePosts.error.objectError}`,
                visibility: 'public'
            });
        }
        else {
            if (timelinePosts.timeline) {
                lastTimeline = timelinePosts.timeline;
                timelinePersistence.SaveData(timelinePosts.timeline);
                const timeline = new Timeline_1.Timeline(timelinePosts.timeline);
                const getPostsWithoutAcessibility = timeline.GetLocalPostswithoutDescription();
                if (getPostsWithoutAcessibility.length <= 0) {
                    statusServiceForGeneralLog.Post({
                        status: `Não há toots com problemas no momento.`,
                        visibility: 'private'
                    });
                    // console.log("Não há toots com problemas")
                }
                getPostsWithoutAcessibility.forEach(post => {
                    if (shouldPostSendToReturnList(post, usersAlreadyWarned.Get())) {
                        if (!sentStatusList.Get().find((sentStatus) => {
                            return sentStatus.id == post.id;
                        })) {
                            sentStatusList.Add(post);
                            postsWithoutAcessibilty.Add(post);
                        }
                    }
                });
                sentPostPersistence.SaveData(sentStatusList.Get());
            }
        }
    }
});
const statusService = new Status_service_1.StatusService();
statusService.Status$.subscribe({
    next: (post) => {
        returnStatusRunner.FreeToAnotherRun();
    },
    error: (err) => {
        returnStatusRunner.FreeToAnotherRun();
        statusServiceForGeneralLog.Post({
            status: `Erro ao postar alerta de acessibilidade: ${err}`,
            visibility: 'public'
        });
    },
});
timelinePersistence.SavedData$.subscribe({
    next: () => {
        // console.log("Timeline atualizada");
        statusServiceForGeneralLog.Post({
            status: `Timeline atualizada`,
            visibility: 'private'
        });
    }
});
sentPostPersistence.SavedData$.subscribe({
    next: () => {
        statusServiceForGeneralLog.Post({
            status: `Lista de posts a serem enviadas atualizada com novos itens`,
            visibility: 'private'
        });
        // console.log("Lista de posts a serem enviadas atualizada");
    }
});
// Status post processor
const returnStatusRunner = new Runner_1.Runner(STATUS_REFRESH_SECONDS, 'Alerta Acessibilidade');
returnStatusRunner.Init(() => {
    const postToReturn = postsWithoutAcessibilty.Top();
    if (postToReturn) {
        const status = (0, Status_1.CreateStatusForNonAcessiblePost)(postToReturn);
        statusService.Post(status);
    }
    else {
        statusServiceForGeneralLog.Post({
            status: `Lista de retorno vazia`,
            visibility: 'private'
        });
        // console.log("lista de retorno vazia")
        returnStatusRunner.FreeToAnotherRun();
    }
});
//  Timeline processor
(0, rxjs_1.combineLatest)([
    timelinePersistence.LoadedData$,
    sentPostPersistence.LoadedData$
]).subscribe({
    next: ([timelineLoaded, sentPostsLoaded]) => {
        statusServiceForGeneralLog.Post({
            status: `Posts já disparados e timeline carregados. Iniciando processamento`,
            visibility: 'public'
        });
        lastTimeline = timelineLoaded;
        sentPostsLoaded.forEach(sentPost => {
            sentStatusList.Add(sentPost);
        });
        timelineRunner.Init(() => {
            timelineService.LoadTimeline(lastTimeline.minId);
        });
    }
});
timelinePersistence.LoadData();
sentPostPersistence.LoadData();
const shouldPostSendToReturnList = (post, usersAlreadyWarned) => {
    return usersAlreadyWarned.find(user => {
        return user.id == post.user.id;
    }) ? false : true;
};
exports.shouldPostSendToReturnList = shouldPostSendToReturnList;
