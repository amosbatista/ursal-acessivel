"use strict";

import moment from "moment";
import { IActivity } from "./IActivity";
import { DATE_FORMAT_SYSTEM } from "./dateFormat.const";

export class ActivityService {
    
  private activity: IActivity;

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

  Get(): IActivity {
    return {... this.activity}
  }
  Init(): IActivity {
    this.activity = {
      today: {
        TimelineReadingErrors: 0,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        LastActivity: this.dateLibrary().format(DATE_FORMAT_SYSTEM)
      },
      allTime: {
        TimelineReadingErrors: 0,
        AcessibilityFailedPosts: 0,
        PostSendErrors: 0,
        StartedAt: this.dateLibrary().format(DATE_FORMAT_SYSTEM)
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
        LastActivity: this.dateLibrary().format(DATE_FORMAT_SYSTEM)
			}
		};
    
    return {... this.activity};
  }

  RegisterNewAcessibilityFailedPost(): IActivity {
    const today = this.dateLibrary();
    const current = this.dateLibrary(this.activity.today.LastActivity, DATE_FORMAT_SYSTEM);

    if(this.IsThisDateToday(current, today)) {
        this.activity = {
            today: {
							...this.activity.today,
							AcessibilityFailedPosts: this.activity.today.AcessibilityFailedPosts + 1,
							LastActivity: today.format(DATE_FORMAT_SYSTEM)
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
					LastActivity: today.format(DATE_FORMAT_SYSTEM)
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
    const current = this.dateLibrary(this.activity.today.LastActivity, DATE_FORMAT_SYSTEM);

    if(this.IsThisDateToday(current, today)) {
        this.activity = {
            today: {
							...this.activity.today,
							PostSendErrors: this.activity.today.PostSendErrors + 1,
							LastActivity: today.format(DATE_FORMAT_SYSTEM)
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
					LastActivity: today.format(DATE_FORMAT_SYSTEM)
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
    const current = this.dateLibrary(this.activity.today.LastActivity, DATE_FORMAT_SYSTEM);

    if(this.IsThisDateToday(current, today)) {
        this.activity = {
            today: {
							...this.activity.today,
							TimelineReadingErrors: this.activity.today.TimelineReadingErrors + 1,
							LastActivity: today.format(DATE_FORMAT_SYSTEM)
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
					LastActivity: today.format(DATE_FORMAT_SYSTEM)
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
}