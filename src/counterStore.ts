import { createStore } from './store';

type State = { count: number };

const initialState: State = { count: 0 };

function reducer(state: State, action: { type: string }): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

export const counterStore = createStore(initialState, reducer);
