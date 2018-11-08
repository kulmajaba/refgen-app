import { combineReducers } from 'redux';

import bookApi, { BookApiState } from './bookApi';
import scanner, { ScannerState } from './scanner';

export interface ApplicationState {
  scanner: ScannerState,
  bookApi: BookApiState
};

export const reducers = combineReducers({
  scanner,
  bookApi
});