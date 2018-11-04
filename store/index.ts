import scanner, { ScannerState } from './scanner';
import bookApi, { BookApiState } from './bookApi';
import { combineReducers } from 'redux';

export interface ApplicationState {
  scanner: ScannerState,
  bookApi: BookApiState
};

export const reducers = combineReducers({
  scanner,
  bookApi
});