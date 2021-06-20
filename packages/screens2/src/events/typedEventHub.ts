type Disposer = () => void;

type ListenerSignature<L> = {
  [E in keyof L]: (...args: any[]) => any;
};

type DefaultListener = {
  [k: string]: (...args: any[]) => any;
};

export default class TypedEventHub<L extends ListenerSignature<L> = DefaultListener> {
  private events = new Map<keyof L, unknown[]>();

  on<U extends keyof L>(event: U, listener: L[U]): Disposer {
    const listeners = this.ensureListeners(event);
    listeners.push(listener);
    return () => {
      const listeners = this.events.get(event);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  getListeners<U extends keyof L>(event: U): L[U][] | undefined {
    return this.events.get(event) as L[U][] | undefined;
  }

  private ensureListeners<U extends keyof L>(event: U): L[U][] {
    const existing = this.events.get(event);
    if (existing) {
      return existing as L[U][];
    } else {
      const list: L[U][] = [];
      this.events.set(event, list);
      return list;
    }
  }
}
