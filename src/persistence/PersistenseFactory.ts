import { writeFile, readFile } from 'node:fs/promises';
import { TimelinePersistence } from '../timeline/Timeline.persistence';
import { UserPersistence } from '../users/User.persistence';

const TimelineFactory = () => {
  return new TimelinePersistence(writeFile, readFile, './data/timeline.json');
}

const UserFactory = () => {
  return new UserPersistence(writeFile, readFile, './data/user.json');
}


export { 
  TimelineFactory,
  UserFactory
}