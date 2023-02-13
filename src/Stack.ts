class StackHelper {
  constructor (
    private stack: any[],
    private name: string,
    private consoleObj: any,
    private canLog: boolean
  ){
    this.Log(`Lista ${this.name} iniciada.`)
  }

  Top () {
    const itemReturn = this.stack.pop();
    this.Log('Item capturado: ' + JSON.stringify(itemReturn))

    return itemReturn;
  }

  Add (newItem: any) {
    this.stack.push(newItem);
    this.Log(`Item adicionado na lista ${this.name}: ` + JSON.stringify(newItem))
  }

  Description () {
    return `Lista ${this.name}: ${this.stack.length} itens.`
  }

  Get() {
    return this.stack;
  }

  Log (content:string) {
    if(this.canLog) {
      this.consoleObj.log(content)
    }
  }
}

export default StackHelper;