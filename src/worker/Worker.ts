import { Observable, Subject } from "rxjs";
import { Runner } from "../Runner";
import { IWorker } from "./IWorker";

export abstract class Worker<EntryType, ReturnType> {

  WorkerEvent$ = new Subject<IWorker<ReturnType>>();
  protected executable: any;
  runner: Runner | undefined;

  abstract Load(): Observable<IWorker<EntryType>>;
  abstract Action(content: IWorker<EntryType>): void;

  constructor(
    private timelineRefreshSeconds: number = 60
  ) {
    this.runner = new Runner(this.timelineRefreshSeconds);
  }

  Init () {
    if(!this.runner) {
      throw new Error('Not runner instantied');
    }
    this.runner.Init(this.executable);
  }

  Emit(value: IWorker<ReturnType>) {
    this.WorkerEvent$.next(value);
  }

  GetTimelineReferesh() {
    return this.timelineRefreshSeconds;
  }

  protected SetExecutable(executable: any) {
    this.executable = executable;
  }
  
}