export const isWorker = typeof self !== "undefined" && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';

export const supportWokerHandle = typeof self !== 'undefined' && 'Worker' in self