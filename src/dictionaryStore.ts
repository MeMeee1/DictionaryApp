// dictionaryStore.ts
import { createStore } from './store';

interface DictionaryState {
  word: string;
  results: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DictionaryState = {
  word: '',
  results: [],
  isLoading: false,
  error: null,
};

function dictionaryReducer(state: DictionaryState, action: { type: string; payload?: any }): DictionaryState {
  switch (action.type) {
    case 'SET_WORD':
      return { ...state, word: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, results: [] };
    default:
      return state;
  }
}

export const dictionaryStore = createStore(initialState, dictionaryReducer);
