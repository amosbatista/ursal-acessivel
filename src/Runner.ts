class Runner {
  canRunAnotherProcess: boolean;
  interval: any;

  constructor(
    private secondsToAnother: number) {
    this.canRunAnotherProcess = true;
  }

  Init(toExecute:any ) {

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