type Action = { type: string } & Record<string, any>;
type Reducer<S> = (state: S, action: Action) => S;

export function createStore<S>(initialState: S, reducer: Reducer<S>) {
  let state = initialState;
  const listeners: (() => void)[] = [];

  function getState(): S {
    return state;
  }

  function dispatch(action: Action) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void): () => boolean {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
        return true;
      }
      return false;
    };
  }

  return { getState, dispatch, subscribe };
}
