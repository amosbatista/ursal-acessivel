import { Subject } from "rxjs";
import { IPersistence } from "./IPersistence";

abstract class Persistence<T> {
  LoadedData$ = new Subject<IPersistence<T>>();
  SavedData$ = new Subject<IPersistence<T>>();
  
  constructor(
    private appendFile: any, 
    private readFile: any,
    private fileDirName: string
  ) {

  }

  LoadData() {
    let contents: string;

    try{
      contents = this.readFile(this.fileDirName, { encoding: 'utf8' });
    }
    catch(error: any) {
      if (error.code === 'ENOENT') {
        this.LoadedData$.next({
          persistenceError: {
            isErrorNoFile: true,
          }
        });
      } else {
        this.LoadedData$.next({
          persistenceError: {
            isErrorNoFile: false,
            errorData: error
          }
        });
      }

      return;
    }
    
    if(contents.trim() === '') {
      this.LoadedData$.next({
        persistenceError: {
          isErrorNoFile: true,
        }
      });

      return;
    }
    this.LoadedData$.next({
      content: JSON.parse(contents),
    });
  }

  SaveData(objectToSave: T) {
    const JSON_INDENT = 2;

    try{
      this.appendFile(this.fileDirName, JSON.stringify(objectToSave, null, JSON_INDENT));
      this.SavedData$.next({
        content: objectToSave
      });
    }
    catch (error: any) {
      
      this.LoadedData$.next({
        persistenceError: {
          isErrorNoFile: false,
          errorData: error
        }
      });
    }
  }  
}

export {  
  Persistence
}