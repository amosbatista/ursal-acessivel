import { Subject } from "rxjs";
import { IPersistence } from "./IPersistence";
import { writeFile, readFile, mkdir, access } from 'node:fs/promises';
import path from 'path'

abstract class Persistence<T> {
  LoadedData$ = new Subject<IPersistence<T>>();
  SavedData$ = new Subject<IPersistence<T>>();
  
  constructor(
    private appendFile = writeFile, 
    private readFileLib = readFile,
    private fileDirName: string,
    private pathLib = path,
    private mkdirLib = mkdir,
    private accessLib = access,
  ) {

  }

  async LoadData() {
    let contents: string;

    try{
      await this.TryCreateFolder(this.fileDirName);
      contents = await this.readFileLib(this.fileDirName, { encoding: 'utf8' });
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
    
    if(!contents) {
      this.LoadedData$.next({
        persistenceError: {
          isErrorNoFile: true,
        }
      });

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

  async TryCreateFolder (fileName: string) {

    const dirName = this.pathLib.dirname(fileName);
    await this.accessLib(dirName).catch(async () => {
      await this.mkdirLib(dirName).catch((e) => {
        throw new Error('Impossível criar arquivo: ' + e);
      });
    })
  }
}

export {  
  Persistence
}