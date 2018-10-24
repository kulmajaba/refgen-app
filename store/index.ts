import scanner, { ScannerState } from './scanner';
import { combineReducers } from 'redux';

export interface ApplicationState {
  scanner: ScannerState
}

export const reducers = combineReducers({
  scanner,
});