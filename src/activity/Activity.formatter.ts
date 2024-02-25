import moment from "moment";
import { IActivity } from "./IActivity";
import { DATE_FORMAT_SYSTEM, DATE_FORMAT_VIEW } from "./dateFormat.const";

class ActivytyFormater {
  constructor (
    private dateLibrary: any = moment
  ) { }

  format(activity: IActivity): IActivity {
    return {
      allTime: {
        ...activity.allTime,
        StartedAt: this.dateLibrary(activity.allTime.StartedAt, DATE_FORMAT_SYSTEM).format(DATE_FORMAT_VIEW)
      },
      today: {
        ...activity.today,
        LastActivity: this.dateLibrary(activity.today.LastActivity, DATE_FORMAT_SYSTEM).format(DATE_FORMAT_VIEW)
      }

    }
  }
}

export { ActivytyFormater }