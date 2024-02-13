"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persistence = void 0;
const rxjs_1 = require("rxjs");
class Persistence {
    constructor(appendFile, readFile, fileDirName) {
        this.appendFile = appendFile;
        this.readFile = readFile;
        this.fileDirName = fileDirName;
        this.LoadedData$ = new rxjs_1.Subject();
        this.SavedData$ = new rxjs_1.Subject();
    }
    async LoadData() {
        const contents = await this.readFile(this.fileDirName, { encoding: 'utf8' });
        this.LoadedData$.next(JSON.parse(contents));
    }
    async SaveData(objectToSave) {
        await this.appendFile(this.fileDirName, JSON.stringify(objectToSave, null, 2));
        this.SavedData$.next(true);
    }
}
exports.Persistence = Persistence;
