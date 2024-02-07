"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityFactory = void 0;
const promises_1 = require("node:fs/promises");
const Activity_persistence_1 = require("./Activity.persistence");
const ActivityFactory = () => {
    return new Activity_persistence_1.ActivityPersistence(promises_1.writeFile, promises_1.readFile, './data/activity.json');
};
exports.ActivityFactory = ActivityFactory;
