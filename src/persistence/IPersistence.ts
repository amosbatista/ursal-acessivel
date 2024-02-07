export interface IPersistence<T> {
  persistenceError?: {
    isErrorNoFile: boolean,
    errorData?: any
  },
  content?: T
}