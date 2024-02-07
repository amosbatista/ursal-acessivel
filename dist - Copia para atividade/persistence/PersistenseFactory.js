"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentPostFactory = exports.UserFactory = exports.TimelineFactory = void 0;
const promises_1 = require("node:fs/promises");
const Post_persistence_1 = require("../posts/Post.persistence");
const Timeline_persistence_1 = require("../timeline/Timeline.persistence");
const User_persistence_1 = require("../users/User.persistence");
const TimelineFactory = () => {
    return new Timeline_persistence_1.TimelinePersistence(promises_1.writeFile, promises_1.readFile, './data/timeline.json');
};
exports.TimelineFactory = TimelineFactory;
const UserFactory = () => {
    return new User_persistence_1.UserPersistence(promises_1.writeFile, promises_1.readFile, './data/user.json');
};
exports.UserFactory = UserFactory;
const SentPostFactory = () => {
    return new Post_persistence_1.PostPersistence(promises_1.writeFile, promises_1.readFile, './data/alreadySentPosts.json');
};
exports.SentPostFactory = SentPostFactory;
