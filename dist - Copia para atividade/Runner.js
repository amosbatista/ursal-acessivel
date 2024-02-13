"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Runner = void 0;
class Runner {
    constructor(secondsToAnother, runnerName) {
        this.secondsToAnother = secondsToAnother;
        this.runnerName = runnerName;
        this.canRunAnotherProcess = true;
    }
    Init(toExecute) {
        // console.log(`Iniciando novo processamento de Runner sob Nome ${this.runnerName} em ${this.secondsToAnother} segundos.` )
        this.interval = setInterval(() => {
            if (this.canRunAnotherProcess == true) {
                this.canRunAnotherProcess = false;
                toExecute();
            }
        }, this.secondsToAnother * 1000);
    }
    FreeToAnotherRun() {
        this.canRunAnotherProcess = true;
    }
    Stop() {
        clearInterval(this.interval);
    }
}
exports.Runner = Runner;
