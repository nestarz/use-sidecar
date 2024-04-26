const isNode = Object.prototype.toString.call(
  typeof (globalThis as any).process !== "undefined"
    ? (globalThis as any).process
    : 0,
) === "[object process]";
const isDeno = typeof (globalThis as any).Deno !== "undefined";
const isBun = typeof (globalThis as any).Bun !== "undefined";

export const env = {
  isServer: isDeno || isNode || isBun,
  forceCache: false,
};
