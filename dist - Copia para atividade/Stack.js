"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StackHelper {
    constructor(stack, name, consoleObj, canLog) {
        this.stack = stack;
        this.name = name;
        this.consoleObj = consoleObj;
        this.canLog = canLog;
        this.Log(`Lista ${this.name} iniciada.`);
    }
    Top() {
        const itemReturn = this.stack.pop();
        this.Log('Item capturado: ' + JSON.stringify(itemReturn));
        return itemReturn;
    }
    Add(newItem) {
        this.stack.push(newItem);
        this.Log(`Item adicionado na lista ${this.name}: ` + JSON.stringify(newItem));
    }
    Description() {
        return `Lista ${this.name}: ${this.stack.length} itens.`;
    }
    Get() {
        return this.stack;
    }
    Log(content) {
        if (this.canLog) {
            this.consoleObj.log(content);
        }
    }
}
exports.default = StackHelper;
