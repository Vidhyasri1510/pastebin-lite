declare global {
  var store: Map<string, string> | undefined;
}

const store = global.store ?? new Map<string, string>();

if (!global.store) {
  global.store = store;
}

const kv = {
  async set(key: string, value: string) {
    store.set(key, value);
  },

  async get(key: string) {
    return store.get(key);
  },

  async del(key: string) {
    store.delete(key);
  },
};

export default kv;
