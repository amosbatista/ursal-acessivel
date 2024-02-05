"use strict";

import moment from "moment";
import { IActivity } from "./IActivity";

// iniciar atividade
// registrar atividade
// reiniciar atividade

export class ActivityService {
    
  private activity: IActivity;
  private DATE_FORMAT_SYSTEM = 'YYYY-MM-DD';
  private DATE_FORMAT_VIEW = 'YYYY-MM-DD';

  constructor (private dateLibrary: any = moment) {
		this.activity =  {
      today: {
        TimelineReadingErrors: 0,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        LastActivity: ''
      },
      allTime: {
        TimelineReadingErrors: 0,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        StartedAt: ''
      }
		}
  }

  Init(): IActivity {
    this.activity = {
      today: {
        TimelineReadingErrors: 0,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        LastActivity: this.dateLibrary().format(this.DATE_FORMAT_SYSTEM)
      },
      allTime: {
        TimelineReadingErrors: 0,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        StartedAt: this.dateLibrary().format(this.DATE_FORMAT_SYSTEM)
      }
    }
    
    return {... this.activity};
  }

  Load(current: IActivity): IActivity {
    this.activity = { 
			...current,
			today: {
				TimelineReadingErrors: 0,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        LastActivity: this.dateLibrary().format(this.DATE_FORMAT_SYSTEM)
			}
		};
    
    return {... this.activity};
  }

  RegisterNewAcessibilityFailedPost(): IActivity {
    const today = this.dateLibrary();
    const current = this.dateLibrary(this.activity.today.LastActivity, this.DATE_FORMAT_SYSTEM);

    if(this.IsThisDateToday(current, today)) {
        this.activity = {
            today: {
							...this.activity.today,
							AcessibilityFailedPosts: this.activity.today.AcessibilityFailedPosts + 1,
							LastActivity: today.format(this.DATE_FORMAT_SYSTEM)
            },
						allTime: {
							...this.activity.allTime,
							AcessibilityFailedPosts: this.activity.allTime.AcessibilityFailedPosts + 1,
						}
        }
    }
		else {
			this.activity = {
				today: {
					TimelineReadingErrors: 0,
					AcessibilityFailedPosts: 1,
					PostSendErrors: 0,
					LastActivity: today.format(this.DATE_FORMAT_SYSTEM)
				},
				allTime: {
					...this.activity.allTime,
					AcessibilityFailedPosts: this.activity.allTime.AcessibilityFailedPosts + 1,
				}
			}
		}

		return { ...this.activity }
  }

	RegisterNewSendStatusError(): IActivity {
    const today = this.dateLibrary();
    const current = this.dateLibrary(this.activity.today.LastActivity, this.DATE_FORMAT_SYSTEM);

    if(this.IsThisDateToday(current, today)) {
        this.activity = {
            today: {
							...this.activity.today,
							PostSendErrors: this.activity.today.PostSendErrors + 1,
							LastActivity: today.format(this.DATE_FORMAT_SYSTEM)
            },
						allTime: {
							...this.activity.allTime,
							PostSendErrors: this.activity.allTime.PostSendErrors + 1,
						}
        }
    }
		else {
			this.activity = {
				today: {
					TimelineReadingErrors: 0,
					AcessibilityFailedPosts: 0,
					PostSendErrors: 1,
					LastActivity: today.format(this.DATE_FORMAT_SYSTEM)
				},
				allTime: {
					...this.activity.allTime,
					PostSendErrors: this.activity.allTime.PostSendErrors + 1,
				}
			}
		}

		return { ...this.activity }
  }

	RegisterNewTimelineReadError(): IActivity {
    const today = this.dateLibrary();
    const current = this.dateLibrary(this.activity.today.LastActivity, this.DATE_FORMAT_SYSTEM);

    if(this.IsThisDateToday(current, today)) {
        this.activity = {
            today: {
							...this.activity.today,
							TimelineReadingErrors: this.activity.today.TimelineReadingErrors + 1,
							LastActivity: today.format(this.DATE_FORMAT_SYSTEM)
            },
						allTime: {
							...this.activity.allTime,
							TimelineReadingErrors: this.activity.allTime.TimelineReadingErrors + 1,
						}
        }
    }
		else {
			this.activity = {
				today: {
					TimelineReadingErrors: 1,
					AcessibilityFailedPosts: 0,
					PostSendErrors: 0,
					LastActivity: today.format(this.DATE_FORMAT_SYSTEM)
				},
				allTime: {
					...this.activity.allTime,
					TimelineReadingErrors: this.activity.allTime.TimelineReadingErrors + 1,
				}
			}
		}

		return { ...this.activity }
  }

  private IsThisDateToday(currentDate: any, todayDate: any, ) {
    return currentDate.diff(todayDate, 'days') <= 0;
}
/*var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const rxjs_1 = require("rxjs");
class Activity {
    constructor(activityFactory, momentService = moment_1.default) {
        this.momentService = momentService;
        this.canStart$ = new rxjs_1.Subject();
        this.errorHappenedAtLoad$ = new rxjs_1.Subject();
        this.activityFile = activityFactory();
    }
    Init() {
        const now = this.momentService().format();
        this.activityFile.SavedData$.subscribe((lastSaved) => {
            this.canStart$.next(lastSaved);
        });
        this.activityFile.ErrorData$.subscribe({
            next: (error) => {
                if (error != this.activityFile.JSON_EMPTY_FILE) {
                    this.errorHappenedAtLoad$.next(error);
                    return;
                }
                const initialState = {
                    today: {
                        TimelineReadingErrors: 0,
                        AcessibilityFailedPosts: 0,
                        PostSendErrors: 0,
                        LastActivity: now
                    },
                    allTime: {
                        TimelineReadingErrors: 0,
                        AcessibilityFailedPosts: 0,
                        PostSendErrors: 0,
                        StartedAt: now
                    }
                };
                this.activityFile.SaveData(initialState);
            },
        });
        this.activityFile.LoadedData$.subscribe({
            next: (loaded) => {
                this.activityFile.SaveData({
                    today: Object.assign(Object.assign({}, loaded.today), { LastActivity: now }),
                    allTime: Object.assign(Object.assign({}, loaded.allTime), { StartedAt: now })
                });
            },
        });
        this.activityFile.LoadData();
    }
    RegisterNewAcessibilityFailedPost() {
        const now = (0, moment_1.default)().format();
        this.activityFile.LoadedData$.subscribe({
            next: (loaded) => {
                if (this.IsThisDateToday(loaded.today.LastActivity)) {
                    this.activityFile.SaveData({
                        today: Object.assign(Object.assign({}, loaded.today), { AcessibilityFailedPosts: loaded.today.AcessibilityFailedPosts + 1, LastActivity: now }),
                        allTime: Object.assign(Object.assign({}, loaded.allTime), { AcessibilityFailedPosts: loaded.allTime.AcessibilityFailedPosts + 1 })
                    });
                }
                else {
                    this.activityFile.SaveData({
                        today: {
                            TimelineReadingErrors: 0,
                            AcessibilityFailedPosts: 1,
                            PostSendErrors: 0,
                            LastActivity: now
                        },
                        allTime: Object.assign(Object.assign({}, loaded.allTime), { AcessibilityFailedPosts: loaded.allTime.AcessibilityFailedPosts + 1 })
                    });
                }
            }
        });
        this.activityFile.LoadData();
    }
    RegisterNewTimelineReadError() {
        const now = this.momentService().format();
        this.activityFile.LoadedData$.subscribe({
            next: (loaded) => {
                if (this.IsThisDateToday(loaded.today.LastActivity)) {
                    this.activityFile.SaveData({
                        today: Object.assign(Object.assign({}, loaded.today), { TimelineReadingErrors: loaded.today.TimelineReadingErrors + 1, LastActivity: now }),
                        allTime: Object.assign(Object.assign({}, loaded.allTime), { TimelineReadingErrors: loaded.allTime.TimelineReadingErrors + 1 })
                    });
                }
                else {
                    this.activityFile.SaveData({
                        today: {
                            TimelineReadingErrors: 1,
                            AcessibilityFailedPosts: 0,
                            PostSendErrors: 0,
                            LastActivity: now
                        },
                        allTime: Object.assign(Object.assign({}, loaded.allTime), { TimelineReadingErrors: loaded.allTime.TimelineReadingErrors + 1 })
                    });
                }
            }
        });
        this.activityFile.LoadData();
    }
    RegisterNewPostError() {
        const now = this.momentService().format();
        this.activityFile.LoadedData$.subscribe({
            next: (loaded) => {
                if (this.IsThisDateToday(loaded.today.LastActivity)) {
                    this.activityFile.SaveData({
                        today: Object.assign(Object.assign({}, loaded.today), { PostSendErrors: loaded.today.PostSendErrors + 1, LastActivity: now }),
                        allTime: Object.assign(Object.assign({}, loaded.allTime), { PostSendErrors: loaded.allTime.PostSendErrors + 1 })
                    });
                }
                else {
                    this.activityFile.SaveData({
                        today: {
                            TimelineReadingErrors: 0,
                            AcessibilityFailedPosts: 0,
                            PostSendErrors: 1,
                            LastActivity: now
                        },
                        allTime: Object.assign(Object.assign({}, loaded.allTime), { PostSendErrors: loaded.allTime.PostSendErrors + 1 })
                    });
                }
            }
        });
        this.activityFile.LoadData();
    }
    IsThisDateToday(date) {
        return this.momentService(date).diff(this.momentService(), 'days') <= 0;
    }
    Load() {
        this.activityFile.LoadData();
    }
}
exports.default = Activity;
*/

}