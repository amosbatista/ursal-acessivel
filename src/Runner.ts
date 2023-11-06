class Runner {
  canRunAnotherProcess: boolean;
  interval: any;

  constructor(
    private secondsToAnother: number,
    private runnerName: string) {
    this.canRunAnotherProcess = true;
  }

  Init(toExecute:any ) {
    console.log(`Iniciando novo processamento de Runner sob Nome ${this.runnerName} em ${this.secondsToAnother} segundos.` )
    this.interval = setInterval(() => {
      if(this.canRunAnotherProcess == true){
        this.canRunAnotherProcess = false;
        toExecute();
      }
    }, this.secondsToAnother * 1000)
  }

  FreeToAnotherRun() {
    this.canRunAnotherProcess = true;
  }

  Stop() {
    clearInterval(this.interval);
  }
}


export { Runner }