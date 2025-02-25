import * as modules from "./modules";
console.log('modules', modules)

Object.assign(self, modules)

const _run = <T extends (...args: Parameters<T>) => ReturnType<T>>({
  func,
  args,
}: {
  func: T;
  args: Parameters<T>;
}) => Promise.resolve(func(...args));

self.onmessage = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  e: MessageEvent<{ func: string; args: Parameters<T> }>
) => {
  const func = new Function(`return ${e.data.func}`)() as T;
    _run({ func, args: e.data.args }).then((result) => {
      self.postMessage(result);
    }).catch(e => {
      self.dispatchEvent(new ErrorEvent("error", e))
    })
};

self.onerror = (e) => {
  throw e
}

// export { };
// const test = (a: number, b: number) => {
//   console.log(a, b);
//   return a + b;
// };

// _run({ func: test, args: [1, 2] });
