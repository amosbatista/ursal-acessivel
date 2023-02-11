class Runner {
  canRunAnotherProcess: boolean;
  interval: any;

  constructor() {
    this.canRunAnotherProcess = true
  }

  Init(toExecute:any ) {

    this.interval = setInterval(() => {
      if(this.canRunAnotherProcess == true){
        this.canRunAnotherProcess = false;
        toExecute();
      }
    }, 5 * 1000)
  }

  FreeToAnotherRun() {
    this.canRunAnotherProcess = true;
  }

  Stop() {
    clearInterval(this.interval);
  }
}


export { Runner }