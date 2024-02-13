import { writeFile, readFile } from 'node:fs/promises';

import { Persistence } from "../persistence/Persistence";
import { IActivity } from './IActivity';

class ActivityPersistence extends Persistence<IActivity> {
  
}

const ActivityFactory = () => {
  return new ActivityPersistence(writeFile, readFile, './data/activity.json');
}

export { ActivityFactory, ActivityPersistence }