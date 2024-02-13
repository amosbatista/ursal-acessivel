"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Stack_1 = __importDefault(require("./Stack"));
describe('Stack test', () => {
    const consoleMock = {
        log: jest.fn()
    };
    beforeEach(() => {
        consoleMock.log.mockClear();
    });
    it('must log a list when class is instantied ', () => {
        const name = "usuários";
        const stack = [{
                nome: "foo",
                id: 1
            }];
        const stackHelper = new Stack_1.default(stack, name, consoleMock, true);
        expect(consoleMock.log).toBeCalledWith('Lista usuários iniciada.');
        expect(stackHelper.Description()).toBe(`Lista usuários: 1 itens.`);
    });
    it('must return the list when get ', () => {
        const name = "usuários";
        const stack = [{
                nome: "foo",
                id: 1
            }];
        const stackHelper = new Stack_1.default(stack, name, consoleMock, true);
        const actual = stackHelper.Get();
        expect(actual).toEqual([{
                nome: "foo",
                id: 1
            }]);
    });
    it('must add an item to list ', () => {
        const name = "usuários";
        const stack = [{
                nome: "foo",
                id: 1
            }];
        const stackHelper = new Stack_1.default(stack, name, consoleMock, true);
        const newItem = {
            nome: "bar",
            id: 2
        };
        stackHelper.Add(newItem);
        expect(consoleMock.log).toHaveBeenLastCalledWith('Item adicionado na lista usuários: {\"nome\":\"bar\",\"id\":2}');
        expect(stackHelper.Description()).toBe(`Lista usuários: 2 itens.`);
    });
    it('must return top item when pop ', () => {
        const name = "usuários";
        const stack = [{
                nome: "foo",
                id: 1
            }];
        const stackHelper = new Stack_1.default(stack, name, consoleMock, true);
        const newItem = {
            nome: "bar",
            id: 2
        };
        stackHelper.Add(newItem);
        stackHelper.Top();
        expect(consoleMock.log).toHaveBeenLastCalledWith('Item capturado: {\"nome\":\"bar\",\"id\":2}');
        expect(stackHelper.Description()).toBe(`Lista usuários: 1 itens.`);
    });
});
