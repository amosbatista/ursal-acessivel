export interface IWorker<T> {
  description: string,
  value?: T,
  error?: {
    message: string,
    data: any
  },
}