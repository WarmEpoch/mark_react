import { supportWokerHandle } from "./constants";
import runWorker from "./run?worker";

interface QueueTask<T extends (...args: Parameters<T>) => ReturnType<T>> {
  func: T;
  args: Parameters<T>;
  resolve: (value: ReturnType<T>) => void;
  reject: (reason?: unknown) => void;
}

class SuperTask {
  private tasks: QueueTask<(...args: unknown[]) => unknown>[] = []
  private runWorker: Worker[]
  private workerKeys: number[] = []
  constructor(private readonly parallelCount = 3) {
    this.runWorker = Array.from({ length: this.parallelCount }, () => new runWorker())
    this.workerKeys = Object.keys(this.runWorker).map(i => Number(i))
  }

  add<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, args: Parameters<T>) {
    return new Promise<ReturnType<T>>((resolve, reject) => {
      (this.tasks as unknown as QueueTask<T>[]).push({ func, args, resolve, reject })
      this.run()
    })
  }

  private run() {
    while(this.tasks.length > 0 && this.workerKeys.length > 0) {
      const task = this.tasks.shift() as QueueTask<typeof this.tasks[number]['func']>
      const key = this.workerKeys.shift() as number
      this.runWorker[key].onerror = () => {
        task.resolve(task.func(...task.args))
        this.workerKeys.push(key)
        this.run()
      }
      this.runWorker[key].onmessage = (e: MessageEvent<ReturnType<typeof task.func>>) => {
        task.resolve(e.data)
        this.workerKeys.push(key)
        this.run()
      }
      this.runWorker[key].postMessage({ func: task.func.toString(), args: task.args })
    }
  }
  
}

declare global {
  interface Window {
    __superTask: SuperTask;
  }
}

if(!window.__superTask) {
  window.__superTask = new SuperTask();
}

export const WorkerWrapper = !supportWokerHandle
  ? <T extends (...args: Parameters<T>) => ReturnType<T>>(
      func: T,
      ...args: Parameters<T>
    ) => Promise.resolve(func(...args))
  : <T extends (...args: Parameters<T>) => ReturnType<T>>(
      func: T,
      ...args: Parameters<T>
    ) => Promise.resolve(window.__superTask.add(func, args));

// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
//   console.log(i)
//   return WorkerWrapper((i: number) => {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(i)
//         }, 1000 * i)
//       })
//     }, i).then(res => {
//       console.log(res)
//     })
// }
// )

// const Worker: <T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, ...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>
// const Worker: <T extends (...args: Parameters<T>) => R, R = ReturnType<T> | Awaited<ReturnType<T>>>(func: T, ...args: Parameters<T>) => Promise<Awaited<R>>
// const Worker: <T extends (...args: Parameters<T>) => R, R = Awaited<ReturnType<T>>>(func: T, ...args: Parameters<T>) => Promise<Awaited<R>>
