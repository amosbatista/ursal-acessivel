import { Subject } from "rxjs";

abstract class Persistence<T> {
  LoadedData$ = new Subject<T>();
  SavedData$ = new Subject<boolean>();
  
  constructor(
    private appendFile: any, 
    private readFile: any,
    private fileDirName: string
  ) {

  }

  async LoadData() {
    const contents = await this.readFile(this.fileDirName, { encoding: 'utf8' });
    this.LoadedData$.next(JSON.parse(contents));
  }

  async SaveData(objectToSave: T) {
    await this.appendFile(this.fileDirName, JSON.stringify(objectToSave, null, 2));
    this.SavedData$.next(true);
  }

  
}

export {  
  Persistence
}